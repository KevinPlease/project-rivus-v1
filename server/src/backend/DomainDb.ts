import { ModelCore } from "../core/Model";
import { MessengerFunction } from "../Messenger";
import MongoDb from "../mongo/MongoDatabase";
import { OperationStatus } from "../shared/Function";
import { DomainData } from "./models/Domain";

export default class DomainDb {
	private _db: MongoDb;
	private _timeOfCreation: number;
	private _timeOfReset: number;
	
	constructor(db: MongoDb) {
		this._db = db;

		this._timeOfCreation = Date.now();
		this._timeOfReset = 0;
	}

	static nameForDomain(domainName: string): string {
		return domainName.toLowerCase() + "_db";
	}

	static mongoDbForDomain(domainName: string, credentials: {username, password}, say: MessengerFunction): MongoDb {
		let dbName = this.nameForDomain(domainName);
		let hostName: string = say(this, "ask", "ownDbHost");
		return new MongoDb(dbName, hostName, credentials);
	}

	static create(domainName: string, credentials: {username, password}, say: MessengerFunction): DomainDb {
		let mongoDb = DomainDb.mongoDbForDomain(domainName, credentials, say);
		return new DomainDb(mongoDb);
	}

	static async createAndConnect(domainName: string, credentials: {username, password}, say: MessengerFunction): Promise<DomainDb> {
		let domainDb = DomainDb.create(domainName, credentials, say);
		await domainDb.safeConnect(say);
		return domainDb;
	}
	
	public get db(): MongoDb { return this._db }
	public get timeOfCreation(): number { return this._timeOfCreation }
	public get timeOfReset(): number { return this._timeOfReset }

	public connect(): Promise<OperationStatus> { return this.db.connect() }
	public safeConnect(say: MessengerFunction): Promise<OperationStatus> { return this.db.safeConnect(say) }

	public getAllDomainData(): Promise<ModelCore<DomainData>[]> {
		const domainsColl = this.db.getCollection("domains");
		return domainsColl.getAll();
	}

	public dropDatabase(): Promise<OperationStatus> {
		this._timeOfReset = Date.now();
		return this.db.drop();
	}
}
