import DomainDb from "../DomainDb";
import { Model, ModelCore } from "../../core/Model";
import { MessengerFunction } from "../../Messenger";
import { OperationStatus } from "../../shared/Function";
import IdCreator from "../IdCreator";
import { ExString } from "../../shared/String";
import { RoleRepo } from "../repos/RoleRepo";
import { BranchRepo } from "../repos/BranchRepo";
import Cache from "../../core/Cache";
import { Branch } from "./Branch";
import IRepository from "../interfaces/IRepository";
import { Dictionary } from "../../types/Dictionary";
import { CounterRepo } from "../repos/CounterRepo";
import { UserRepo } from "../repos/UserRepo";
import { BaseRepo } from "../repos/BaseRepo";

const SYS_NAME = process.env.SYS_NAME || "";
if (!SYS_NAME) throw "Missing environment variable for SYS_NAME!";

type DomainData = {
	branches: string[],
	name: string,
	username: string,
	password: string
};

class Domain extends Model<DomainData> {
	public static ROLE = "domain";

	private _branchesCache: Cache<Branch>;
	private _repoCache: Cache<BaseRepo<Dictionary>>;
	private _branchRepo: BranchRepo | null;
	private _counterRepo: CounterRepo | null;
	private _database: DomainDb;
	private _roleRepo: RoleRepo | null;
	private _userRepo: UserRepo | null;
	
	constructor(core: ModelCore<DomainData>, domainDb: DomainDb) {
		super(core);
		
		this._branchesCache = new Cache();
		this._repoCache = new Cache();
		this._branchRepo = null;
		this._counterRepo = null;
		this._roleRepo = null;
		this._userRepo = null;
		
		this._database = domainDb;
	}

	public get database(): DomainDb { return this._database }
	public get name(): string { return this.data.name }

	static create(name: string, branches: string[], credentials: {username: string, password: string}, say: MessengerFunction): Domain {
		const lowcaseName = name.toLowerCase();
		const data : DomainData = { branches, name, ...credentials};

		const repository = SYS_NAME.toLowerCase() + "_domains";
		const repoName = "domains";
		const model = Model._create(say, data, repository, repoName);
		model.id = lowcaseName;

		const domainDb = DomainDb.create(lowcaseName, credentials, say);
		return new Domain(model.toJSON(), domainDb);
	}

	static async createAndConnect(name: string, branches: string[], credentials: {username: string, password: string}, say: MessengerFunction): Promise<Domain> {
		const domain = Domain.create(name, branches, credentials, say);
		await domain.connectDb(say);
		return domain.initializeRepositories(say);
	}

	static async createSystem(say: MessengerFunction): Promise<Domain> {
		const credentials = say(this, "ask", "credentials");
		const domain = Domain.create(SYS_NAME, [], credentials, say);
		const result = await domain.database.connect();
		if (!result) throw "Problem connecting to system_db";

		return domain;
	}

	static byName(domainName: string, say: MessengerFunction): Domain {
		return say(this, "ask", "domainByName", domainName);
	}

	static fromUserId(userId: string, say: MessengerFunction): Domain | undefined {
		const domainName = ExString.upToBefore(userId, ".");
		return Domain.byName(domainName, say);
	}

	static system(say: MessengerFunction): Domain { return Domain.byName(SYS_NAME, say) }

	private async initializeRepositories(say: MessengerFunction) : Promise<Domain> {
		const domainName = this.name;
		const db = this.database.db;

		const branchRepoId = IdCreator.createRepoId(BranchRepo.REPO_NAME, domainName);
		const branchColl = db.getCollection(branchRepoId);
		const branchRepo = BranchRepo.create(branchColl, domainName);
		this._repoCache.set(branchRepo, branchRepo.repoName);

		const branchCores = await branchRepo.getMany(say);
		for (const branchCore of branchCores) {
			const branch = new Branch(branchCore);
			this._branchesCache.set(branch, branch.data.name);
		}

		const counterRepoId = IdCreator.createRepoId(CounterRepo.REPO_NAME, domainName);
		const counterColl = db.getCollection(counterRepoId);
		const counterRepo = CounterRepo.create(counterColl, domainName);
		this._repoCache.set(counterRepo, counterRepo.repoName);
		await counterRepo.addDefaultData(say);

		const roleRepoId = IdCreator.createRepoId(RoleRepo.REPO_NAME, domainName);
		const roleColl = db.getCollection(roleRepoId);
		const roleRepo = RoleRepo.create(roleColl, domainName);
		this._repoCache.set(roleRepo, roleRepo.repoName);
		await roleRepo.addDefaultData(say);

		const userRepoId = IdCreator.createRepoId(UserRepo.REPO_NAME, domainName);
		const userColl = db.getCollection(userRepoId);
		const userRepo = UserRepo.create(userColl, domainName);
		this._repoCache.set(userRepo, userRepo.repoName);

		this.dispatch("domain connected", this);

		return this;
	}

	public getBranchByName(name: string) : Branch {
		return this._branchesCache.getBy(name);
	}

	public getAllBranches() : Branch[] {
		return this._branchesCache.getAll();
	}

	public addBranchRef(subjectDomain: Domain, branch: Branch): Promise<OperationStatus> {
		if (this.name !== SYS_NAME) throw "BAD CALL: addBranchRef must be called from system Domain only!";

		const updateQuery = { "data.branches": branch.id };
		const idQuery = { "data.name": subjectDomain.name };
		const domainColl = this.database.db.getCollection("domains");
		return domainColl.pushInList(idQuery, updateQuery);
	}

	public getRepoByName(name: string): BaseRepo<Dictionary> | null {
		return this._repoCache.getBy(name);
	}

	connectDb(say: MessengerFunction): Promise<OperationStatus> { return this.database.safeConnect(say) }

}

export { Domain };
export type { DomainData };
