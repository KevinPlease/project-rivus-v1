import { AddUserOptions, Admin, Db, Document, MongoClient, MongoClientOptions } from "mongodb";
import { Functions, OperationStatus } from "../shared/Function";
import ObjOverride from "../shared/Object";
import { MessengerFunction } from "../Messenger";
import MongoCollection from "./MongoCollection";
import { ExString } from "../shared/String";

class MongoDb {
	private _clientOptions: MongoClientOptions;
	private _credentials: {username: string, password: string};
	private _db: Db | null;
	private _dbName: string;
	private _hostname: string;

	constructor(dbName: string, hostname: string, credentials: {username: string, password: string}, clientOptions: MongoClientOptions = {}) {
		this._dbName = dbName;
		this._hostname = hostname;
		this._credentials = credentials;
		this._clientOptions = clientOptions;

		this._db = null;
	}

	static async exists(name: string, say: MessengerFunction): Promise<boolean> {
		let result = false;

		try {
			let sysMongoDb : MongoDb = say(this, "ask", "sysMongoDb");
			const admin = sysMongoDb.getAdmin();
			if (!admin) throw `Missing Admin user for db: ${sysMongoDb._dbName}`;

			let cursor = await admin.listDatabases();
			result = cursor.databases.some((dbData) => dbData.name === name);

		} catch (error) {
			console.warn(error.message);
		}

		return result;
	}


	public getAdmin() : Admin | null {
		return this._db?.admin() || null;
	}

	public addUser(username: string, password: string, options: AddUserOptions) : Promise<Document> | null {
		return this._db?.addUser(username, password, options) || null;
	}


	getConnectionUrl(): string {
		let credentialsPart = "";
		let credentials = this._credentials;

		if (! ObjOverride.isDictEmpty(credentials) ) {
			credentialsPart = credentials.username + ":" + credentials.password + "@";
		}

		let sysDbName = ExString.uncapitalize(process.env.SYS_NAME || "") + "_db";
		if (sysDbName === this._dbName) {
			sysDbName = "admin";
		}

		return `mongodb://${credentialsPart}${this._hostname}/${this._dbName}?authSource=${sysDbName}`;
	}


	async connect(): Promise<OperationStatus> {
		let result: OperationStatus = "failure";
		let clientOptions = this._clientOptions;
		
		try {
			let connectionUrl = this.getConnectionUrl();
			let client = await MongoClient.connect(connectionUrl, clientOptions);
			this._db = client.db();
			result = "success";

		} catch (error) {
			console.warn(error.message);
		}

		return result;
	}


	async safeConnect(say: MessengerFunction): Promise<OperationStatus> {
		let result: OperationStatus = "failure";
		
		try {
			// first-time db creation: create admin
			let dbExists = await MongoDb.exists(this._dbName, say);
			if (!dbExists) return this.connectAsAdmin(say);

			result = await this.connect();

		} catch (error) {
			console.warn(error.message);
		}

		return result;
	}


	createCollection(name: string): Promise<OperationStatus> {
		return Functions.doSimpleAsync(this._db, "createCollection", name);
	}


	dropCollection(name: string): Promise<OperationStatus> {
		return Functions.doSimpleAsync(this._db, "dropCollection", name);
	}

	
	listCollections(queryObj: {}): Promise<[]> {
		return Functions.doAsync(this._db, "listCollections", queryObj);
	}

	getCollection(name: string): MongoCollection {
		let db = this._db;
		if (!db) throw "Database not connected!";

		let collection = db.collection(name);
		return new MongoCollection(name, collection);
	}


	drop(): Promise<OperationStatus> {
		return Functions.doSimpleAsync(this._db, "drop");
	}


	async createIndexedCollection(collectionName: string): Promise<MongoCollection> {
		await this.createCollection(collectionName);
		let mongoColl = this.getCollection(collectionName);
		await mongoColl.createIndex({id: 1});
		return mongoColl;
	}

	
	// Adds a new high-level admin user in the mongo 'admin' db with required roles for the new db
	// NOTE: Should be called from the system_db
	addAdmin(say: MessengerFunction): Promise<OperationStatus> {
		let credentials = this._credentials;
		let dbName = this._dbName;
		let sysMongoDb : MongoDb = say(this, "ask", "sysMongoDb");
		let roles = [{ role: "dbAdmin", db: dbName }, { role: "readWrite", db: dbName }, { role: "userAdmin", db: dbName }];
		return Functions.doSimpleAsync(sysMongoDb, "addUser", credentials.username, credentials.password, { roles });
	}

	// Adds a db admin in the new domain's db
	addDbUser(): Promise<OperationStatus> {
		let credentials = this._credentials;
		let db = this._db;
		let dbName = this._dbName;
		let roles = [{ role: "readWrite", db: dbName }, { role: "dbAdmin", db: dbName }];
		return Functions.doSimpleAsync(db, "addUser", credentials.username, credentials.password, { roles });
	}


	async connectAsAdmin(say: MessengerFunction): Promise<OperationStatus>  {
		let status = await this.addAdmin(say);
		if (status === "failure") return status;
		
		status = await this.connect();
		if (status === "failure") return status;

		return this.addDbUser();
	}
}

export default MongoDb;
