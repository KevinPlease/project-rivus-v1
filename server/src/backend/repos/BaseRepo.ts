import { ObjectId } from "mongodb";
import { Communicator } from "../../communications/Communicator";
import { Model, ModelCore } from "../../core/Model";
import { MessengerFunction } from "../../Messenger";
import MongoCollection from "../../mongo/MongoCollection";
import { ExString } from "../../shared/String";
import { Dictionary, GenericDictionary } from "../../types/Dictionary";
import { OperationStatus, Operation } from "../../types/Operation";
import IdCreator from "../IdCreator";
import IRepoMiddleware from "../interfaces/IRepoMiddleware";
import IRepository, { IRepoOptions } from "../interfaces/IRepository";
import { Branch } from "../models/Branch";
import MongoQuery, { AggregationInfo } from "../models/MongoQuery";
import { AccessType } from "../types/Access";
import { DetailedFind, DetailedGetMany } from "../types/DetailedFind";
import { Filter } from "../types/Filter";
import { PaginationOptions } from "../types/PaginationOptions";

enum ERepoEvents {
	BEFORE_UPDATE = "BEFORE_UPDATE",
	AFTER_UPDATE = "AFTER_UPDATE",
	BEFORE_ADD = "BEFORE_ADD",
	AFTER_ADD = "AFTER_ADD"
}

class BaseRepo<ModelData extends Dictionary> extends Communicator implements IRepository<ModelData> {
	public static REPO_NAME = "_bases";
	public static MODEL_ROLE_NAME = "_base";
	
	private _collection: MongoCollection;
	private _repoName: string;
	private _modelRole: string;
	private _branch?: string;
	private _domain: string;
	private _id: string;
	private _lastUpdated?: number | undefined;
	
	public middleware?: IRepoMiddleware | undefined;
	public options: IRepoOptions;

	constructor(newCollection: MongoCollection, repoName: string, modelRole: string, domain: string, branch?: string, options?: IRepoOptions) {
		super();

		this._repoName = repoName;
		this._modelRole = modelRole;
		this._collection = newCollection;
		this._domain = domain;
		this._branch = branch;
		this._id = branch ? IdCreator.createBranchedRepoId(repoName, branch, domain) : IdCreator.createRepoId(repoName, domain);
		this.options = options || {};
	}
	

	public get collection(): MongoCollection { return this._collection }
	public set collection(value: MongoCollection) { this._collection = value }
	public get branch(): string | undefined { return this._branch }
	public get domain(): string { return this._domain }
	public get repoName(): string { return this._repoName }
	public get modelRole(): string { return this._modelRole }
	public get id(): string { return this._id }
	public get lastUpdated(): number { return this._lastUpdated || 0 }

	public static create(collection: MongoCollection, domain: string, branch?: string, options?: IRepoOptions) {
		return new BaseRepo(collection, this.REPO_NAME, this.MODEL_ROLE_NAME, domain, branch, options);
	}

	public static getInstance(say: MessengerFunction): BaseRepo<Dictionary> {
		return say(this, "ask", "repo", this.REPO_NAME);
	}

	private async _create(data: Dictionary, say: MessengerFunction): Promise<string> {
		const middleware = this.middleware;
		const isSysCall = say(this, "ask", "isSysCall");
		if (!middleware || isSysCall === true) return this._collection.insertOne(data);

		const createQuery = await middleware.validateCreateQuery(data, this.modelRole, say) || data;
		return this._collection.insertOne(createQuery);
	}
	
	private async _read(query: Dictionary, say: MessengerFunction, project?: Dictionary): Promise<ModelCore<ModelData> | null> {
		const middleware = this.middleware;
		const isSysCall = say(this, "ask", "isSysCall");
		if (!middleware || isSysCall === true) return this._collection.findOne(query, project);

		const repoAccess = await middleware.getAccessInfo(say);
		if (!repoAccess) return null;

		const aggregation = MongoQuery.makePrivilegedAggregation(repoAccess, this._repoName, this._modelRole, query, say);
		return this._collection.findOneAsAggregation(aggregation);
	}
	
	private async _readMany(say: MessengerFunction, query?: Dictionary, project?: Dictionary, sort?: Dictionary, pagination?: PaginationOptions): Promise<ModelCore<ModelData>[]> {
		const middleware = this.middleware;
		const isSysCall = say(this, "ask", "isSysCall");
		if (!middleware || isSysCall === true) return this._collection.getMany(query, pagination, project, sort);

		const repoAccess = await middleware.getAccessInfo(say);
		if (!repoAccess) return [];

		const aggregation = MongoQuery.makePrivilegedAggregation(repoAccess, this._repoName, this._modelRole, query, say);
		return this._collection.getManyAsAggregation(aggregation, pagination, sort, project);
	}
	private async _readManyAsAggregation(exAggregation: Dictionary[], say: MessengerFunction, pagination?: PaginationOptions): Promise<ModelCore<ModelData>[]> {
		const middleware = this.middleware;
		const isSysCall = say(this, "ask", "isSysCall");
		if (!middleware || isSysCall === true) return this._collection.getManyAsAggregation(exAggregation, pagination);

		const repoAccess = await middleware.getAccessInfo(say);
		if (!repoAccess) return [];

		const aggregation = MongoQuery.makePrivilegedAggregation(repoAccess, this._repoName, this._modelRole, {}, say);
		const finalAggregation = aggregation.concat(exAggregation);
		return this._collection.getManyAsAggregation(finalAggregation, pagination);
	}

	public async _readAsAggregation(exAggregation: Dictionary[], say: MessengerFunction, project?: Dictionary): Promise<ModelCore<ModelData> | null> {
		const middleware = this.middleware;
		const isSysCall = say(this, "ask", "isSysCall");
		if (!middleware || isSysCall === true) return this._collection.findOneAsAggregation(exAggregation);

		const repoAccess = await middleware.getAccessInfo(say);
		if (!repoAccess) return null;

		const aggregation = MongoQuery.makePrivilegedAggregation(repoAccess, this._repoName, this._modelRole, {}, say);
		const finalAggregation = aggregation.concat(exAggregation);
		return this._collection.findOneAsAggregation(finalAggregation);
	}

	public createQueryFromFilter(filter: Filter | Filter[] | undefined): Dictionary {
		let query = MongoQuery.create(filter);
		
		if (this.options.needsDraftModels) {
			const notDraft = MongoQuery.notFieldExists("data.isDraft");
			query = Array.isArray(filter) && query["$and"] ? query["$and"] : query;
			query = MongoQuery.safeAttachToOr(query, notDraft);
		}

		return query;
	}

	public async update(query: Dictionary, data: Dictionary, say: MessengerFunction): Promise<OperationStatus> {
		const middleware = this.middleware;
		const isSysCall = say(this, "ask", "isSysCall");
		if (!middleware || isSysCall === true) return this._collection.updateOne(query, data);

		const repoAccess = await middleware.getAccessInfo(say);
		if (!repoAccess) return "failure";

		const core = await this._read(query, say);
		if (!core) return "failure";

		const userId = say(this, "ask", "ownUserId");
		const accessInfo = repoAccess[ ExString.betweenFirstTwo(core.repository, "/", "@") ];
		const isOverseerUpdate = accessInfo.global[this.modelRole].write === AccessType.OVERSEER;
		const isSelfishUpdate = accessInfo.global[this.modelRole].write === AccessType.SELFISH && (core.data.assignee === userId || core.meta.creator === userId);
		if (isOverseerUpdate || isSelfishUpdate) {
			const updateQuery = await middleware.validateUpdateQuery(query._id, data, this.modelRole, say) || data;
			return this._collection.updateOne(query, updateQuery);

		}

		return "failure";
	}

	private _delete(query: Dictionary, say: MessengerFunction): Promise<OperationStatus> {
		return this._collection.deleteMany(query);
	}

	public createAggregation(query: Dictionary, say: MessengerFunction): Dictionary[] {
		console.info(`${this.repoName}#createAggregation -> CHECK if this should be custom implemented?`);

		const aggInfo : AggregationInfo[] = [];

		const sort = {
			"meta.timeCreated": -1
		};

		return MongoQuery.makeAggregation(aggInfo, query, sort);
	}

	public async add(model: Model<ModelData>, say: MessengerFunction): Promise<OperationStatus> {
		if (this.options.needsDisplayIds) {
			// NOTE: cyclic dependency if importing CounterRepo, therefore we use direct dependency injection
			const counterRepo = say(this, "ask", "repo", "counters");
			const status = await counterRepo.setDisplayIdToModel(model, say);
			if (status === "failure") return status;

		}

		const isDraft = model.data.isDraft;
		const timeCreated = isDraft ? 0 : Date.now();
		model.meta.timeCreated = timeCreated;

		const operation: Operation = await this.dispatch(ERepoEvents.BEFORE_ADD, { model });
		if (operation.status === "failure") return "failure";

		const insertedId = await this._create(model, say);
		if (!insertedId) return "failure";

		if (!isDraft && this.options.needsLastUpdateTime) {
			this._lastUpdated = timeCreated;
		}

		model.id = insertedId;
		return "success";
	}

	public addMany(dataArr: ModelData[], say: MessengerFunction): Promise<OperationStatus> {
		const branch: Branch = say(this, "ask", "ownBranch");
		const domainName = this._domain;
		const modelRole = this._modelRole;
		const repoName = this._repoName;
		const cores = dataArr.map(data => Model._create(say, data, repoName, modelRole, { domain: domainName, branch: branch.data.name }).toNoIdJSON());
		return this._collection.insertMany(cores);
	}

	public async edit(id: string, model: Model<ModelData>, say: MessengerFunction): Promise<OperationStatus> {
		if (this.options.needsLastUpdateTime) {
			this._lastUpdated = Date.now();
		}

		model.meta.timeUpdated = Date.now();
		return this.update({ _id: new ObjectId(id) }, model, say);
	}

	public async editData(id: string, data: ModelData, say: MessengerFunction): Promise<Operation> {
		if (this.options.needsLastUpdateTime) {
			this._lastUpdated = Date.now();
		}
		
		const meta: Dictionary = { timeUpdated: Date.now() };
		const existingModel = await this.findById(id, say);
		if (!existingModel) return { status: "failure", message: "" };

		if (existingModel.meta.timeCreated === 0) {
			meta.timeCreated = meta.timeUpdated;
		}

		await this.dispatch(ERepoEvents.BEFORE_UPDATE, { id, data, meta });

		const query = MongoQuery.createUpdateData({ meta, data });
		const idQuery = { _id: new ObjectId(id) };
		const status = await this.update(idQuery, query, say);
		
		await this.dispatch(ERepoEvents.AFTER_UPDATE, { model: existingModel, data, meta, status });
		
		return { status, message: status ? "Success!" : "Failed to Update!" };
	}
	
	public get(filter: Filter, say: MessengerFunction): Promise<ModelCore<ModelData> | null> {
		const query = this.createQueryFromFilter(filter);
		return this._read(query, say);
	}

	public getMany(say: MessengerFunction, filter?: Filter | undefined, pagination?: PaginationOptions | undefined): Promise<ModelCore<ModelData>[]> {
		const query = this.createQueryFromFilter(filter);
		const aggregation = this.createAggregation(query, say);
		return this._readManyAsAggregation(aggregation, say, pagination);
	}

	public async detailedGetMany(say: MessengerFunction, filter?: Filter | Dictionary, pagination?: PaginationOptions): Promise<DetailedGetMany<ModelCore<ModelData>>> {
		const cores = await this.getMany(say, filter, pagination);
		const formDetails = await this.getFormDetails(say);
		
		const count = cores[0]?.totalCount || 0;
		return { count, formDetails, models: cores };
	}

	public getSimplifiedMany(say: MessengerFunction, filter?: Filter | Dictionary, pagination?: PaginationOptions): Promise<Dictionary[]> {
		const query = this.createQueryFromFilter(filter);
		const project = { "_id": 1, "data.name": 1, "repository": 1 };
		return this._readMany(say, query, project, undefined, pagination);
	}

	public async getFormDetails(say: MessengerFunction): Promise<GenericDictionary<Dictionary[]>> {
		throw "BaseRepo -> MUST be custom implemented for each Repo!";

		return { source: [], assignee: [] };
	}

	public remove(id: string, say: MessengerFunction): Promise<OperationStatus> {
		return this._delete({ _id: new ObjectId(id) }, say);
	}

	public async findById(id: string, say: MessengerFunction, projection?: Dictionary): Promise<Model<ModelData> | null> {
		const query = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { displayId: id };
		const core = await this._read(query, say, projection);
		if (!core) return null;

		return new Model(core);
	}

	public async findByName(name: string, say: MessengerFunction): Promise<Model<ModelData> | null> {
		const query = { "data.name": name };
		const core = await this._read(query, say);
		if (!core) return null;

		return new Model(core);
	}

	// TODO: Consider adapting this to use _readAsAggregation instead AND support for Events.
	public async detailedFind(query: Dictionary, say: MessengerFunction): Promise<DetailedFind<Model<ModelData>> | null> {
		const core = await this._read(query, say);
		if (!core) return null;

		const model = new Model(core);
		const formDetails = await this.getFormDetails(say);
		return { formDetails, model };
	}

	public detailedFindById(id: string, say: MessengerFunction): Promise<DetailedFind<Model<ModelData>> | null> {
		const query = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { displayId: id };
		return this.detailedFind(query, say);
	}

	public async findDraft(say: MessengerFunction) : Promise<DetailedFind<Model<ModelData>> | null> {
		const creator = say(this, "ask", "ownUserId");
		const query = { "data.isDraft": true, "meta.creator": creator };
		return this.detailedFind(query, say);
	}

}

export { BaseRepo, ERepoEvents };
