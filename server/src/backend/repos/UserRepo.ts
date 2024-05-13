import { ModelCore } from "../../core/Model";
import TokenKeeper from "../../core/TokenKeeper";
import { MessengerFunction } from "../../Messenger";
import MongoCollection from "../../mongo/MongoCollection";
import { Dictionary, GenericDictionary } from "../../types/Dictionary";
import { Operation, OperationStatus } from "../../types/Operation";
import IRepoMiddleware from "../interfaces/IRepoMiddleware";
import PrivilegeKeeper from "../middlewares/PrivilegeKeeper";
import MongoQuery, { AggregationInfo } from "../models/MongoQuery";
import { User, UserData } from "../models/User";
import { DetailedFind } from "../types/DetailedFind";
import { BaseDocimgRepo } from "./BaseDocRepo";
import { ERepoEvents } from "./BaseRepo";
import { BranchRepo } from "./BranchRepo";
import { RoleRepo } from "./RoleRepo";


class UserRepo extends BaseDocimgRepo<UserData> {
	public static REPO_NAME = "users";
	public static MODEL_ROLE_NAME = User.ROLE;

	private _middleware?: IRepoMiddleware;

	public static create(collection: MongoCollection, domain: string) {
		const userRepo = new UserRepo(collection, this.REPO_NAME, this.MODEL_ROLE_NAME, domain);
		
		userRepo._middleware = new PrivilegeKeeper()

		return userRepo;
	}

	public static getInstance(say: MessengerFunction): UserRepo {
		return super.getInstance(say) as UserRepo;
	}

	private findUserByEmail(email: string) : Promise<ModelCore<UserData> | null> {
		const query = { "data.email": email };
		return this.collection.findOne(query);
	}

	private async findByUserName(name: string, say: MessengerFunction) : Promise<User | null> {
		const query = { "data.username": name };
		const userCore = await this.collection.findOne(query);
		if (!userCore) return null;

		return new User(userCore);
	}

	public createAggregation(query: Dictionary, say: MessengerFunction): Dictionary[] {
		const roleRepoId = RoleRepo.getInstance(say).id;
		const project = {
			"data.name": 1,
			"repository": 1
		};
		const aggInfo : AggregationInfo[] = [
			{
				repoToJoinFrom: roleRepoId,
				fieldToSet: "data.role",
				project
			},
		];

		const sort = {
			"meta.timeCreated": -1
		};

		return MongoQuery.makeAggregation(aggInfo, query, sort);
	}

	public async add(model: User, say: MessengerFunction): Promise<OperationStatus> {
		this.subscribeOnce(ERepoEvents.BEFORE_ADD, async (source:Object, m: User) => {
			const userOperation = await this.validateRequestForNewUser(m.data.email);
			if (userOperation.status === "failure") return "failure";
			
			model.data.password = TokenKeeper.encryptPass(model.data.password);
			return "success";
		});

		return super.add(model, say);
	}

	public async validateRequestForNewUser(userEmail: string) : Promise<Operation> {
		const user = await this.findUserByEmail(userEmail);
		if (user) return { message: "Email already taken.", status: "failure" };

		return { message: "Valid Request.", status: "success" };
	}

	public async findUserByToken(authToken: string, say: MessengerFunction) : Promise<DetailedFind<User> | null> {
		const userInfo = await say(this, "ask", "infoFromToken", authToken);
		if (!userInfo) return null;

		return this.detailedFindById(userInfo.id, say);
	}

	public async getFormDetails(say: MessengerFunction): Promise<GenericDictionary<Dictionary[]>> {
		const roleRepo = RoleRepo.getInstance(say);
		const role = await roleRepo.getSimplifiedMany(say);
		
		const branchRepo = BranchRepo.getInstance(say);
		const branch = await branchRepo.getSimplifiedMany(say);

		return { branch, role };
	}

	public async detailedFind(query: Dictionary, say: MessengerFunction): Promise<DetailedFind<User> | null> {
		const aggregation = this.createAggregation(query, say);
		const userCore = await this._readAsAggregation(aggregation, say);
		if (!userCore) return null;

		// TODO: Aggregation for data.roles not adapted/accounted for.
		const model = new User(userCore);
		const ownRoleId = model.data.roles[model.getBranchName()];
		const roleRepo = RoleRepo.getInstance(say);
		userCore.data.role = await roleRepo.findById(ownRoleId, say); 
		
		const formDetails = await this.getFormDetails(say);
		return { formDetails, model };
	}

	public async authUser(userName: string, password: string, say: MessengerFunction) : Promise<Operation> {
		const existingUser = await this.findByUserName(userName, say);
		if (!existingUser) return { message: "User does not exist!", status: "failure" };

		const userEncPass = existingUser.data.password;
		const areMatching = await TokenKeeper.areMatchingPasswords(password, userEncPass);
		if (!areMatching) return { message: "Wrong password.", status: "failure" };
	
		let token = existingUser.data.token;
		const userSignedIn = await say(this, "ask", "infoFromToken", token);
		if (userSignedIn) return { message: { token }, status: "success" };

		token = await say(this, "ask", "tokenFromInfo", { id: existingUser.id, pw: userEncPass });
		existingUser.data.token = token;
		await this.edit(existingUser.id, existingUser, say);
		return { message: { token }, status: "success" };
	}

	public async changePassword(userId: string, oldPassword: string, newPassword: string, say: MessengerFunction): Promise<Operation> {
		const user = await this.findById(userId, say);
		if (!user) return { message: "User does not exist!", status: "failure" };

		const userEncPass = user.data.password;
		const areMatching = await TokenKeeper.areMatchingPasswords(oldPassword, userEncPass);
		if (!areMatching) return { message: "Wrong old password.", status: "failure" };

		user.data.password = TokenKeeper.encryptPass(newPassword);
		
		const status = await this.edit(userId, user, say);
		const message = status === "success" ? "success" : "db_update_problem";
		return { status, message };
	}

	public async logoutUser(userId: string, say: MessengerFunction) : Promise<Operation> {
		throw("WIP");
	}

	public addRoleToUsers(query: Dictionary, branchName: string, roleId: string): Promise<OperationStatus> {
		const keyName = "data.roles." + branchName;
		return this.collection.updateMany(query, { [keyName]: roleId });
	}

}

export { UserRepo };
