import { MessengerFunction } from "../../Messenger";
import MongoCollection from "../../mongo/MongoCollection";
import { Branch, BranchData } from "../models/Branch";
import { BaseRepo } from "./BaseRepo";

class BranchRepo extends BaseRepo<BranchData> {
	public static REPO_NAME = "branches";
	public static MODEL_ROLE_NAME = Branch.ROLE;

	public static create(collection: MongoCollection, domain: string) {
		return new BranchRepo(collection, this.REPO_NAME, this.MODEL_ROLE_NAME, domain);
	}

	public static getInstance(say: MessengerFunction): BranchRepo {
		return super.getInstance(say) as BranchRepo;
	}

	public async isBranchPresent(name: string): Promise<boolean> {
		const query = { "data.name": name };
		const count = await this.collection.count(query);
		return count > 0;
	}

}

export { BranchRepo };
