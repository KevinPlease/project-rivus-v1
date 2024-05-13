import { Model, ModelCore } from "../../core/Model";
import { MessengerFunction } from "../../Messenger";
import MongoCollection from "../../mongo/MongoCollection";
import { OperationStatus } from "../../shared/Function";
import { Dictionary, GenericDictionary } from "../../types/Dictionary";
import { Operation } from "../../types/Operation";
import { DetailedFind, DetailedGetMany } from "../types/DetailedFind";
import { Filter } from "../types/Filter";
import { PaginationOptions } from "../types/PaginationOptions";
import IRepoMiddleware from "./IRepoMiddleware";

interface IRepoOptions {
	needsDisplayIds?: boolean;
	needsLastUpdateTime?: boolean;
	needsDraftModels?: boolean;
}

interface IRepository<Data extends Dictionary> {
	options: IRepoOptions;
	collection: MongoCollection;
	domain: string;
	id: string;
	lastUpdated?: number;
	middleware?: IRepoMiddleware;

	createQueryFromFilter(filter: Filter | Filter[] | undefined): Dictionary;

	createAggregation(query: Dictionary, say: MessengerFunction): Dictionary[];

	add(model: Model<Data>, say: MessengerFunction): Promise<OperationStatus>;
	
	addMany(core: Data[], say: MessengerFunction): Promise<OperationStatus>;

	edit(id: string, model: Model<Data>, say: MessengerFunction): Promise<OperationStatus>;
	
	editData(id: string, data: Data, say: MessengerFunction): Promise<Operation>;

	get(filter: Filter | Dictionary, say: MessengerFunction): Promise<ModelCore<Data> | null>;
	
	getMany(say: MessengerFunction, filter?: Filter | Dictionary, pagination?: PaginationOptions): Promise<ModelCore<Data>[]>;

	detailedGetMany(say: MessengerFunction, filter?: Filter | Dictionary, pagination?: PaginationOptions): Promise<DetailedGetMany<ModelCore<Data>>>;

	getFormDetails(say: MessengerFunction): Promise<GenericDictionary<Dictionary[]>>;

	remove(id: string, say: MessengerFunction): Promise<OperationStatus>;

	findById(id: string, say: MessengerFunction, projection?: Dictionary): Promise<ModelCore<Data> | null>;

	findByName(name: string, say: MessengerFunction): Promise<Model<Data> | null>;

	detailedFind(query: Dictionary, say: MessengerFunction): Promise<DetailedFind<Model<Data>> | null>;

	detailedFindById(id: string, say: MessengerFunction): Promise<DetailedFind<Model<Data>> | null>;

	findDraft(say: MessengerFunction): Promise<DetailedFind<Model<Data>> | null>;
}

export type { IRepoOptions };
export default IRepository;