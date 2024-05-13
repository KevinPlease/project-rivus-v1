import { ObjectId } from "mongodb";
import { MessengerFunction } from "../../Messenger";
import MongoCollection from "../../mongo/MongoCollection";
import { Role, RoleData } from "../models/Role";
import { BaseRepo } from "./BaseRepo";
import { UserRepo } from "./UserRepo";
import { ModelCore } from "../../core/Model";
import { Access, RepoAccess } from "../types/Access";
import { OperationStatus } from "../../types/Operation";
import { getDefaultData } from "../data/roles";

class RoleRepo extends BaseRepo<RoleData> {
	public static REPO_NAME = "roles";
	public static MODEL_ROLE_NAME = Role.ROLE;

	public static create(collection: MongoCollection, domain: string) {
		return new RoleRepo(collection, this.REPO_NAME, this.MODEL_ROLE_NAME, domain);
	}

	public static getInstance(say: MessengerFunction): RoleRepo {
		return super.getInstance(say) as RoleRepo;
	}

	public async isActionPresent(actionId: string, roleId: string | ObjectId): Promise<boolean> {
		if (!ObjectId.isValid(roleId)) return false;

		const _id = roleId instanceof ObjectId ? roleId : new ObjectId(roleId);
		const query = { _id, "data.actions": actionId };
		const count = await this.collection.count(query);
		return count > 0;
	}

	public async getPrivileges(userId: string, say: MessengerFunction): Promise<RepoAccess | null> {
		const msngr = (source: Object, purpose: string, what: string, content?: any): any => {
			if (purpose === "ask" && what === "isSysCall") return true;

			return say(source, purpose, what, content);
		};

		const userRepo = UserRepo.getInstance(say);
		const user = await userRepo.findById(userId, msngr);
		if (!user) return null;

		const repoAccess: RepoAccess = {};
		const rolesDict = user.data.roles;
		for (const branchName in rolesDict) {
			const branchRole = rolesDict[branchName];
			if (!branchRole) continue;

			
			const query = { _id: new ObjectId(branchRole) };
			const roleCore: ModelCore<RoleData> = await this.collection.findOne(query);
			if (!roleCore) continue;

			repoAccess[branchName] = roleCore.data.accessInfo;
		}

		return repoAccess;
	}

	public async getPrivilegesForBranch(branchName: string, userId: string, say: MessengerFunction): Promise<Access | null> {
		const msngr = (source: Object, purpose: string, what: string, content?: any): any => {
			if (purpose === "ask" && what === "isSysCall") return true;

			return say(source, purpose, what, content);
		};

		const userRepo = UserRepo.getInstance(say);
		const user = await userRepo.findById(userId, msngr);
		if (!user) return null;

		const branchRole = user.data.roles[branchName];
		if (!branchRole) return null;

		const query = { _id: new ObjectId(branchRole) };
		const accessInfoCore = await this.collection.findOne(query);
		if (!accessInfoCore) return null;
		
		return accessInfoCore.data.accessInfo;
	}

	public async addDefaultData(say: MessengerFunction): Promise<OperationStatus> {
		const count = await this.collection.count({});
		if (count > 0) return "success";

		const actionCores = getDefaultData(this.domain);
		return this.collection.insertMany(actionCores);
	}

}

export { RoleRepo };
