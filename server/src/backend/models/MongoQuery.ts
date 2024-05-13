import { Dictionary, GenericDictionary } from "../../types/Dictionary";
import ObjOverride from "../../shared/Object";
import { Filter } from "../types/Filter";
import { Rule } from "../types/Rule";
import { MessengerFunction } from "../../Messenger";
import { ObjectId } from "mongodb";
import ExArray from "../../shared/Array";
import IdCreator from "../IdCreator";
import { Domain } from "./Domain";
import { ExString } from "../../shared/String";
import { BaseRepo } from "../repos/BaseRepo";
import { AccessType, FieldAccess, RepoAccess } from "../types/Access";

type AggregationInfo = {
	repoToJoinFrom: string;
	fieldToSet: string;
	project?: Dictionary;
}

class MongoQuery {

	private static getNewValueForQuery(value: string | any[]): any[] {
		if (Array.isArray(value)) {
			return value.map(innerVal => {
				// if (ObjectId.isValid(innerVal)) return new ObjectId(innerVal);

				innerVal = innerVal.replace(/\+/g, "\\+");
				return new RegExp(String(innerVal), "gi");
			});
		}

		// if (ObjectId.isValid(value)) return [new ObjectId(value)];

		value = String(value).replace(/\+/g, "\\+");
		return [new RegExp(value, "gi")];
	}

	private static _create(filter: Filter | undefined): Dictionary {
		const isValidFilter = filter && !ObjOverride.isDictEmpty(filter.data);
		if (!isValidFilter) return {};

		const queryValues: Dictionary[] = [];

		const filterData = filter.data;
		for (const prop in filterData) {
			const rule: Rule = filterData[prop];
			
			let newValues: any[] = [];
			let valueInQuery: any;
			if (rule.type === "range") {
				valueInQuery = {};
				const values = rule.values;
				const fromValue = values[0];
				const toValue = values[1];
				if (fromValue !== undefined && fromValue !== null) valueInQuery["$gte"] = fromValue;
				if (toValue !== undefined && toValue !== null) valueInQuery["$lte"] = toValue;
			} else {
				rule.values.forEach(value => {
					const innerArr = MongoQuery.getNewValueForQuery(value);
					newValues = [...newValues, ...innerArr];
				});
				valueInQuery = rule.comparator === "INCLUDES" ? { $in: newValues } : newValues[0];
			}

			// TODO: Should not be hard-coded here; rethink?	#Kevin
			const fieldToQuery = prop === "displayId" || prop.startsWith("meta") ? prop : `data.${prop}`;
			queryValues.push({
				[fieldToQuery]: valueInQuery
			});
		}

		return { [`$${filter.type}`]: queryValues };
	}

	public static create(filters: Filter[] | Filter | undefined): Dictionary {
		if (!filters) return {};
		
		if (Array.isArray(filters) && ExArray.isEmpty(filters)) return {};

		if (!Array.isArray(filters)) filters = [filters];
		const queries = filters.map(MongoQuery._create);
		return { "$and": queries };
	}

	public static createUpdateData(modelData: Dictionary, parentPath?: string): Dictionary {
		let query = {};
		for (const fieldName in modelData) {
			let curParentPath = parentPath ? parentPath + "." + fieldName : fieldName;
			const fieldVal = modelData[fieldName];

			if (typeof fieldVal === "object") {
				if (!Array.isArray(fieldVal)) {
					const data = MongoQuery.createUpdateData(fieldVal, curParentPath);
					query = { ...query, ...data };
					continue;
				}
			}

			query[curParentPath] = fieldVal;
		}

		return query;
	}

	public static notFieldExists(fieldName: string): Dictionary[] {
		return [{ [fieldName]: false }, { [fieldName]: { $not: { $exists: fieldName } } }];
	}

	private static lookupQuery(from: string, localField: string, project?: Dictionary) {
		const query: Dictionary = {
			from,
			localField,
			"foreignField": "_id",
			as: localField
		};

		if (project) {
			query.pipeline = [
				{
					"$project": {
						"_id": 1,
						...project
					}
				}
			]
		}

		return query;
	}

	private static conditionalObjIdSet(info: AggregationInfo) {
		const fieldToSet = "$" + info.fieldToSet;
		return {
			"$cond": {
				if: {
					$or: [
						{ $eq: [fieldToSet, ""] },
						{ $eq: [fieldToSet, "_CENSORED_"] },
						{ $eq: [fieldToSet, []] }
					]
				},
				then: fieldToSet,
				else: { $toObjectId: fieldToSet }
			}
		};
	}

	private static conditionalCensoredField(repository: string, fieldName: string, say: MessengerFunction) {
		const userId = say(this, "ask", "ownUserId");
		const field = "$" + fieldName;
		return {
			$cond: {
				if: {
					$or: [
						{ $not: { $eq: ["$repository", repository] }},
						{ $eq: ["$meta.creator", userId] },
						{ $eq: ["$data.assignee", userId] }
					]
				},
				then: field,
				else: {
					$cond: {
						if: { $isArray: field },
						then: [],
						else: "_CENSORED_"
					}
				}
			}
		};
	}

	private static toFixArrayStage(info: AggregationInfo) {
		const fieldToSet = "$" + info.fieldToSet;
		return {
			"$cond": {
				if: {
					$lte: [fieldToSet, null],
				},
				then: { _id: "", data: { name: "" } },
				else: fieldToSet,
			}
		};
	}

	private static conditionalArraySet(infoArr: AggregationInfo[]) {
		const stage = {
			"$set": {}
		};

		infoArr.forEach(info => {
			const fieldName = info.fieldToSet;
			stage["$set"][fieldName] = MongoQuery.toFixArrayStage(info);
		});

		return stage;
	}

	private static lookupStage(info: AggregationInfo) {
		return {
			"$lookup": MongoQuery.lookupQuery(info.repoToJoinFrom, info.fieldToSet, info.project)
		};
	}

	private static unwindStage(info: AggregationInfo) {
		return {
			"$unwind": { path: "$" + info.fieldToSet, preserveNullAndEmptyArrays: true }
		};
	}

	private static toObjectIdStage(infoArr: AggregationInfo[]) {
		const stage = {
			"$set": {}
		};


		infoArr.forEach(info => {
			const fieldName = info.fieldToSet;
			stage["$set"][fieldName] = MongoQuery.conditionalObjIdSet(info);
		});

		return stage;
	}

	private static setTotalCountStage() {
		return {
			$setWindowFields: {
			  output: {
				totalCount: {
				  $count: {}
				}
			  }
			}
		};
	}

	private static privilegedRepoMatchQuery(repository: string, userId?: string) {
		const query: Dictionary = { $and: [ { repository } ] };
		
		if (userId) {
			query.$and.push({
				$or: [
					{ "data.assignee": userId },
				  	{ "meta.creator": userId },
				  	{ _id: new ObjectId(userId) }
				]
			});
		}

		return query;
	}

	private static privilegedRepoCensorship(repository: string, fieldAccess: FieldAccess, say: MessengerFunction) {
		const stageSet = {};

		for (const fieldName in fieldAccess) {
			const accessType = fieldAccess[fieldName].read;

			if (!stageSet["$set"]) stageSet["$set"] = {};

			if (accessType === AccessType.MISS || accessType === AccessType.REDACTED) {
				const dataFieldName = "data." + fieldName;
				stageSet["$set"][dataFieldName] = MongoQuery.conditionalCensoredField(repository, dataFieldName, say);
			}
		}

		return stageSet;
	}

	public static safeAttachToOr(query: Dictionary, value: any): Dictionary {
		if (Array.isArray(query)) {
			const queryToModify = query.find(q => q["$or"] !== undefined);
			if (queryToModify) {
				const newQuery = {
					$and: [
						{ $or: value },
						{ $or: queryToModify["$or"] }
					]
				};
				
				ExArray.replace(query, queryToModify, newQuery);
			} else {
				query.push({ "$or": value });
			}
			
			query = { "$and": query };

		} else {
			if (query["$or"]) {
				query = {
					$and: [
						{ $or: value },
						{ $or: query["$or"] }
					]
				};
			} else {
				query["$or"] = value;
			}	
		}

		return query;
	}

	// TODO: Consider making this dynamic -- Builder pattern?
	public static makeAggregation(infoArr: AggregationInfo[], filter: Dictionary, sort?: GenericDictionary<number>): Dictionary[] {
		const stages: Dictionary[] = [];

		infoArr.forEach(info => {
			const lookupStage = MongoQuery.lookupStage(info);
			stages.unshift(lookupStage);

			const unwindStage = MongoQuery.unwindStage(info);
			stages.push(unwindStage);
		});

		const secondStage = MongoQuery.toObjectIdStage(infoArr);
		stages.unshift(secondStage);

		const firstStage = { "$match": filter };
		stages.unshift(firstStage);

		const arrayFixStage = MongoQuery.conditionalArraySet(infoArr);
		stages.push(arrayFixStage);

		const sortStage = { "$sort": sort };
		stages.push(sortStage);

		const setTotalCountStage = MongoQuery.setTotalCountStage();
		stages.push(setTotalCountStage);

		return stages;
	}

	public static makeMatchCountAggregation(subject: "properties" | "opportunities", targetId: string): Dictionary[] {
		const queryAggregation = MongoQuery.makeMatchForModelAggregation(subject, targetId, 0.7);

		const aggregation: Dictionary[] = [
			{
				$unwind:
				{
					path: `$data.result.findings.${subject}`,
					includeArrayIndex: "string",
					preserveNullAndEmptyArrays: false
				}
			},
			{
				$count: "matchCount"
			}
		];

		return queryAggregation.concat(aggregation);
	}

	public static makeMatchForModelAggregation(subject: "properties" | "opportunities", targetId: string, minAverageScore?: number): Dictionary[] {
		if (!minAverageScore) minAverageScore = 0;

		const target = subject === "properties" ? "opportunity" : "property";
		const aggregation: Dictionary[] = [
			{
				"$match": {
					[`data.result.findings.${subject}.${target}._id`]: targetId,
					"data.status": "finished"
				}
			},
			{
				$project: {
					[`data.result.findings.${subject}`]: {
						$filter: {
							input: `$data.result.findings.${subject}`,
							as: "item",
							cond: {
								$and: [
									{ $eq: [`$$item.${target}._id`, targetId] },
									{ $gte: ["$$item.average", minAverageScore] }
								]
							}
						}
					}
				}
			}
		];

		return aggregation;
	}

	public static makePrivilegedAggregation(repoAccess: RepoAccess, repoName: string, role: string, query: Dictionary = {}, say: MessengerFunction): Dictionary[] {
		// Match only documents which are allowed in the repoAccess
		const ownDomain: Domain = say(this, "ask", "ownDomain");
		const userId = say(this, "ask", "ownUserId");
		const aggregation: Dictionary[] = [];
		const repoQueries: Dictionary[] = [];
		
		const validRoleName = ExString.uncapitalize(repoName);
		for (const branchName in repoAccess) {
			const access = repoAccess[branchName];
			const readAccess = access.global[role].read;
			
			const repository = IdCreator.createBranchedRepoId(validRoleName, branchName, ownDomain.name);
			if (readAccess === AccessType.SELFISH) {
				repoQueries.push(MongoQuery.privilegedRepoMatchQuery(repository, userId));
				
			} else if (readAccess !== AccessType.MISS) {
				repoQueries.push(MongoQuery.privilegedRepoMatchQuery(repository));
			}
			
			const fieldAccess = access.fieldAccess[role];
			const censorshipStage = MongoQuery.privilegedRepoCensorship(repository, fieldAccess, say);
			if (!ObjOverride.isDictEmpty(censorshipStage)) {
				aggregation.push(censorshipStage);
			}
		}

		query = MongoQuery.safeAttachToOr(query, repoQueries);
		
		aggregation.unshift({
			"$match": query
		});

		aggregation.push(MongoQuery.setTotalCountStage());
		
		return aggregation;
	}

}

export default MongoQuery;
export type { AggregationInfo };
