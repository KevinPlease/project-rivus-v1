import "./env";
import CFG_BACKEND from "./backend/config";
import CFG_WEB from "./network/config";
import { DEFAULT_DEBUG_PORT, PRIORITIES } from "./service/config";

const ENV = process.env;
const CONNECTION_MODE = ENV.mode || "development";
if (!ENV.DB_USERNAME || !ENV.DB_PASSWORD) throw "Missing environment variable for DB credentials!";

const DB_CREDENTIALS = { username: ENV.DB_USERNAME, password: ENV.DB_PASSWORD };
const SYS_NAME = ENV.SYS_NAME || "";
if (!SYS_NAME) throw "Missing environment variable for SYS_NAME!";

import Cache from "./core/Cache";
import { Domain } from "./backend/models/Domain";
import { Messenger, MessengerFunction } from "./Messenger";
import TokenKeeper from "./core/TokenKeeper";
import { Functions, OperationStatus } from "./shared/Function";
import Folder from "./files/Folder";
import File from "./files/File";
import WebServer from "./network/WebServer";
import Logger from "./core/Logger";
import { Communicator } from "./communications/Communicator";

import UrlUtils from "url";
import IdCreator from "./backend/IdCreator";
import IRepository from "./backend/interfaces/IRepository";
import { Dictionary } from "./types/Dictionary";
import { Branch } from "./backend/models/Branch";
import { ExString } from "./shared/String";
import WorkerKeeper from "./service/WorkerKeeper";
import RepoRequest from "./backend/types/RepoRequest";
import { ModelCore } from "./core/Model";
import { WorkData } from "./service/Work";
import ImgEnhancMaster from "./enhancers/ImgEnhancMaster";
import ImageEnhancement from "./enhancers/ImageEnhancement";
import { BranchRepo } from "./backend/repos/BranchRepo";
import { ActionRepo } from "./backend/repos/ActionRepo";
import { UserRepo } from "./backend/repos/UserRepo";
const __dirname = UrlUtils.fileURLToPath(new UrlUtils.URL(".", import.meta.url));

class Application extends Communicator {
	private _domainCache: Cache<Domain>;
	private _folder: Folder;
	private _logger: Logger;
	private _msngr: MessengerFunction;
	private _sysDomain: Domain | null;
	private _tokenKeeper: TokenKeeper;
	private _webServer: WebServer | null;
	private _actionRepo: ActionRepo | null;
	private _workerKeeper: WorkerKeeper;
	private _imgEnhancMaster: ImgEnhancMaster;

	constructor(msngr: MessengerFunction) {
		super();

		this._sysDomain = null;
		this._domainCache = new Cache();
		this._actionRepo = null;

		const onMessage = Functions.bound(this, "onMessage") as MessengerFunction;
		this._folder = Folder.fromPath(__dirname, onMessage);
		this._logger = new Logger(onMessage);
		this._msngr = msngr;
		
		this._workerKeeper = WorkerKeeper.create(DEFAULT_DEBUG_PORT, onMessage);
		
		this._imgEnhancMaster = new ImgEnhancMaster(PRIORITIES);
		// [DISABLED] Image Enhancer scheduling.
		// this._imgEnhancMaster.initScheduling(onMessage);

		this._tokenKeeper = new TokenKeeper(CFG_BACKEND.TOKEN_SECRET);
		this._webServer = null;
	}


	static async createAndRun(): Promise<void> {
		const __filename = UrlUtils.fileURLToPath(import.meta.url);
		const context = __filename.slice(__dirname.length + 1, -3);
		const rootSay = new Messenger(context, CFG_BACKEND.verboseEnabled).say;
		const application = new Application(rootSay);
		const onMessage = Functions.bound(application, "onMessage") as MessengerFunction;

		application._sysDomain = await Domain.createSystem(onMessage);
		
		const actionRepoId = IdCreator.createRepoId(ActionRepo.REPO_NAME, SYS_NAME);
		const actionColl = application._sysDomain.database.db.getCollection(actionRepoId);
		application._actionRepo = ActionRepo.create(actionColl, SYS_NAME);
		await application._actionRepo.addDefaultData(onMessage);

		application._webServer = await WebServer.fromParts(CFG_WEB, onMessage);

		application.subscribe("domain connected", (source: Object, domain: Domain) => {
			console.log(`Domain ${domain.name} connected and cached.`);
			application._domainCache.set(domain);
		});

		application.subscribe("server connected", (source: Object, arg: string) => {
			// NOTE: Empty
		});

		// TODO: Can be further generalized in the future by passing a msg.type
		// application.subscribe("work started", (source: Object, msg: Dictionary) => {
		// 	if (msg.type === ImageEnhancement.ROLE) {
		// 		application._imgEnhancMaster.startWork(msg.id, onMessage);
		// 	}
		// });
		// application.subscribe("work finished", (source: Object, msg: Dictionary) => {
		// 	if (msg.type === ImageEnhancement.ROLE) {
		// 		application._imgEnhancMaster.handleFinishedWork(msg.content, onMessage);
		// 	}
		// });

		application.subscribe("branch added", function(source: Object, branch: Branch) {
			const branchRepo = source as BranchRepo;
			const domain = Domain.byName(branchRepo.domain, onMessage);
			
			const sysDomain = Domain.system(onMessage);
			sysDomain.addBranchRef(domain, branch);

			const userRepo = UserRepo.getInstance(onMessage);
			userRepo.addRoleToUsers({}, branch.data.name, process.env.DEFAULT_ROLE_ID || "");
		});

		return application.run();
	}


	getOwnDbHost(): string {
		const DB_CONN_INFO = CFG_BACKEND.DB[CONNECTION_MODE];
		return DB_CONN_INFO.HOST + ":" + DB_CONN_INFO.PORT;
	}

	async createLogsFolder(): Promise<OperationStatus> {
		const LOGS_FOR = CFG_BACKEND.LOGS_FOR;
		let logsFolder = this._folder.getChildFolder(LOGS_FOR.ROOT);
		let promSystemLogs = logsFolder.createFolderIfMissing(LOGS_FOR.SYSTEM);
		let promApiLogs = logsFolder.createFolderIfMissing(LOGS_FOR.API);
		let responses = await Promise.all([promSystemLogs, promApiLogs]);

		let status: OperationStatus = "success";
		if (responses[0] === "failure" || responses[1] === "failure") {
			console.warn("Problem creating log folders!");
			status = "failure";
		}

		return status;
	}

	getLogsFolder(type: string) {
		let logsFolder = this._folder.getChildFolder(CFG_BACKEND.LOGS_FOR.ROOT);
		return logsFolder.getChildFolder(type);
	}

	getLogTypes() {
		const LOGS_FOR = { ...CFG_BACKEND.LOGS_FOR };
		return Object.values(LOGS_FOR);
	}

	async getCertificationInfo(): Promise<{ key: string; cert: string; ca: string; }> {
		let certificationObj = CFG_BACKEND.SERVER_CERTIFICATION[CONNECTION_MODE];

		let privKeyFile = File.fromPath(certificationObj.privateKey);
		let certificationFile = File.fromPath(certificationObj.certification);
		let chainFile = File.fromPath(certificationObj.chain);

		let key = await privKeyFile.read();
		let cert = await certificationFile.read();
		let ca = await chainFile.read();
		return { key, cert, ca };
	}


	getCreationToken(): number {
		let sysDomain = this._sysDomain;
		if (!sysDomain) throw "System Domain not connected.";

		return sysDomain.database.timeOfCreation;
	}

	getResetToken(): number {
		let sysDomain = this._sysDomain;
		if (!sysDomain) throw "System Domain not connected.";

		return sysDomain.database.timeOfReset;
	}

	getUniqueTokenVars(): { serverStartToken: number, resetToken: number, creationToken: number } {
		let creationToken = this.getCreationToken();
		let resetToken = this.getResetToken();
		let serverStartToken = this._webServer?.serverStartToken || 0;
		return { serverStartToken, resetToken, creationToken };
	}

	public getRepoForInfo(repoRequest: RepoRequest): IRepository<Dictionary> | null {
		const repoName = repoRequest.repoName;
		
		let repo = this.getRepo(repoName);
		if (repo) return repo;

		repo = repoRequest.domain.getRepoByName(repoName);
		if (repo) return repo;

		return null;
	}

	public getRepo(name: string): IRepository<Dictionary> | null {
		switch (name) {
			case ActionRepo.REPO_NAME: return this._actionRepo;
		}

		return null;
	}

	private getDomainByRepoId(repoId: string): Domain {
		const onMessage = Functions.bound(this, "onMessage") as MessengerFunction;
		return Domain.byName(ExString.sinceAfterLast(repoId, "@"), onMessage);
	}

	private getBranchByRepoId(repoId: string): Branch {
		const onMessage = Functions.bound(this, "onMessage") as MessengerFunction;
		const domain = Domain.byName(ExString.sinceAfterLast(repoId, "@"), onMessage);
		return domain.getBranchByName(ExString.betweenFirstTwo(repoId, "/", "@"));
	}

	async createAndConnectDomains(say: MessengerFunction): Promise<void> {
		let sysDomain = this._sysDomain;
		if (!sysDomain) throw "System Domain not connected.";

		let domainsCores = await sysDomain.database.getAllDomainData();
		let promises = domainsCores.map(core => {
			const data = core.data;
			const credentials = { username: data.username, password: data.password };
			return Domain.createAndConnect(data.name, data.branches, credentials, say);
		});
		await Promise.all(promises);

		return;
	}

	private getCachedDomain(name: string): Domain | null {
		const lowcaseName = ExString.uncapitalize(name);
		const lowcaseSysName = ExString.uncapitalize(SYS_NAME);
		if (lowcaseName === lowcaseSysName) return this._sysDomain;

		return this._domainCache.getBy(lowcaseName);
	}

	private async getDependenciesForWork<ExecInfo>(workInfo: { workCore: ModelCore<WorkData<ExecInfo>>, lastUpdated: number }): Promise<Dictionary | null> {
		// TODO: should become generic by checking some work type etc.
		return {};
	}

	onMessage(source: Object, purpose: string, what: string, content: any): any {
		const onMessage = Functions.bound(this, "onMessage") as MessengerFunction;
		if (purpose === "ask") {
			switch (what) {
				case "domains": return this._domainCache.getAll();
				case "branchById": return this.getBranchByRepoId(content);
				case "certificationInfo": return this.getCertificationInfo();
				case "connectionMode": return CONNECTION_MODE;
				case "credentials": return DB_CREDENTIALS;
				case "domainByName": return this.getCachedDomain(content);
				case "hostUrlForDomain": return this._webServer?.getHostUrlForDomain(content);
				
				case "repo": return this.getRepo(content);
				case "repoForInfo": return this.getRepoForInfo(content);

				case "worker": return this._workerKeeper.requestExecution(content);
				case "work": return null;	// TODO: Should become generic via workType (or like below).
				case ImageEnhancement.ROLE: return this._imgEnhancMaster.createWork(content, onMessage);
				case "workDependencies": return this.getDependenciesForWork(content);

				case "rootPathOf": return Folder.joinPaths(this._folder.path, content);
				case "ownDbHost": return this.getOwnDbHost();
				case "infoFromToken": return this._tokenKeeper.decodeAndVerifyToken(content);
				case "tokenFromInfo": return this._tokenKeeper.getTokenFromInfo(content);
				case "secretToken": return CFG_BACKEND.TOKEN_SECRET;
				case "sysMongoDb": return this._sysDomain?.database.db;
				case "uniqueVarInfo": return this.getUniqueTokenVars();
				case "isVerbose": return false;
			}
		}

		return this._msngr(source, purpose, what, content);
	}

	async run(): Promise<void> {
		let onMessage = Functions.bound(this, "onMessage") as MessengerFunction;
		await this.createAndConnectDomains(onMessage);
		return this._webServer?.start();
	}
}


// Start
Functions.doAsync(Application, "createAndRun");
