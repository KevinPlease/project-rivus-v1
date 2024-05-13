import ExObject from "../shared/Object";
import { Collection } from "mongodb";
import { Functions, OperationStatus } from "../shared/Function";
import { Dictionary } from "../types/Dictionary";
import { PaginationOptions } from "../backend/types/PaginationOptions";

// TODO: Consider using Generic types to have a MongoCollection for a specific type of data e.g. MongoCollection<Core> -> MongoCollection< ModelCore<LocationData> >
// THEREFORE replacing the return type Dictionary with MongoCollection<Core>
class MongoCollection {
	private _collection: Collection;
	private _name: string;
	
	constructor(name: string, collection: Collection) {
		this._name = name;
		this._collection = collection;
	}

	public get name(): string { return this._name }

	createIndex(queryObj: Dictionary): Promise<string> {
		return Functions.doAsync(this._collection, "createIndex", queryObj, { unique: true });
	}


	deleteMany(queryObj: Dictionary): Promise<OperationStatus> {
		return Functions.doSimpleAsync(this._collection, "deleteMany", queryObj);
	}


	async insertOne(queryObj: Dictionary): Promise<string> {
		let obj = queryObj;
		
		if (queryObj.toNoIdJSON) obj = queryObj.toNoIdJSON();

		const insertRes = await Functions.doAsync(this._collection, "insertOne", obj);
		return insertRes?.insertedId.toString();
	}

	insertMany(objs: {[key: string]: any}[]): Promise<OperationStatus> {
		return Functions.doSimpleAsync(this._collection, "insertMany", objs);
	}


	upsertOne(queryObj: Dictionary, updateObj: Dictionary): Promise<OperationStatus> {
		let obj = updateObj;
		
		if (updateObj.toNoIdJSON) obj = updateObj.toNoIdJSON();

		return Functions.doSimpleAsync(this._collection, "updateOne", queryObj, { $set: obj }, { upsert: true });
	}


	updateOne(queryObj: Dictionary, updateObj: Dictionary): Promise<OperationStatus> {
		let obj = updateObj;
		
		if (updateObj.toNoIdJSON) obj = updateObj.toNoIdJSON();

		return Functions.doSimpleAsync(this._collection, "updateOne", queryObj, { $set: obj }, { upsert: false });
	}

	updateMany(queryObj: Dictionary, updateObj: Dictionary): Promise<OperationStatus> {
		let obj = updateObj;
		
		if (updateObj.toNoIdJSON) obj = updateObj.toNoIdJSON();

		return Functions.doSimpleAsync(this._collection, "updateMany", queryObj, { $set: obj }, { upsert: false });
	}

	pushInList(queryObj: Dictionary, updateObj: Dictionary): Promise<OperationStatus> {
		let obj = updateObj;
		
		if (updateObj.toNoIdJSON) obj = updateObj.toNoIdJSON();

		return Functions.doSimpleAsync(this._collection, "updateOne", queryObj, { $push: obj }, { upsert: false });
	}

	removeFromList(queryObj: Dictionary, updateObj: Dictionary): Promise<OperationStatus> {
		let obj = updateObj;
		
		if (updateObj.toNoIdJSON) obj = updateObj.toNoIdJSON();

		return Functions.doSimpleAsync(this._collection, "updateOne", queryObj, { $pull: obj }, { upsert: false });
	}

	find(queryObj: Dictionary, sort: Dictionary = {}, project: Dictionary = {}): Promise<any | null> {
		let cursor = this._collection.find(queryObj)
		
		if (sort) cursor.sort(sort);
		
		if (project) cursor.project(project);

		cursor.limit(1);

		return Functions.doAsync(cursor, "next");
	}

	findOne(queryObj: Dictionary, project: Dictionary = {}): Promise<any | null> {
		return Functions.doAsync(this._collection, "findOne", queryObj, { projection: project });
	}


	getMany(queryObj?: Dictionary, pagination?: PaginationOptions, project?: Dictionary, sortObj?: Dictionary): Promise<any[]> {
		let cursor = this._collection.find(queryObj || {}).sort(sortObj || {});

		if (pagination && !ExObject.isDictEmpty(pagination)) {
			cursor.skip(pagination.pageNr).limit(pagination.itemsPerPage);
		}
		
		if (project && !ExObject.isDictEmpty(project)) {
			cursor.project(project);
		}

		return Functions.doAsync(cursor, "toArray");
	}

	getManyAsAggregation(aggregationPipeline: Dictionary[], pagination?: PaginationOptions, sortObj?: Dictionary, project?: Dictionary) {
		const cursor = this._collection.aggregate(aggregationPipeline);
		
		if (sortObj) cursor.sort(sortObj);
		
		if (project) cursor.project(project);

		if (pagination && pagination.pageNr !== undefined && pagination.itemsPerPage !== undefined) {
			const skipCount = pagination.pageNr * pagination.itemsPerPage;
			cursor.skip(skipCount).limit(pagination.itemsPerPage);
		}

		return Functions.doAsync(cursor, "toArray");
	}

	findOneAsAggregation(aggregationPipeline: Dictionary[]) {
		const cursor = this._collection.aggregate(aggregationPipeline);
		return Functions.doAsync(cursor, "next");
	}

	getAll(): Promise<any[]> { return this.getMany({}) }

	async count(queryObj: Dictionary): Promise<number> {
		const count = await Functions.doAsync(this._collection, "count", queryObj);
		return count || 0;
	}

	remove(): Promise<OperationStatus> {
		return Functions.doSimpleAsync(this._collection, "drop");
	}

}

export default MongoCollection;
