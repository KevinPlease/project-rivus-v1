import { ObjectId } from "mongodb";
import MongoCollection from "../../mongo/MongoCollection";
import { Action, ActionData } from "../models/Action";
import { BaseRepo } from "./BaseRepo";
import { MessengerFunction } from "../../Messenger";
import { getDefaultData } from "../data/actions";
import { OperationStatus } from "../../types/Operation";

class ActionRepo extends BaseRepo<ActionData> {
	public static REPO_NAME = "actions";
	public static MODEL_ROLE_NAME = Action.ROLE;

	public static create(collection: MongoCollection, domain: string) {
		return new ActionRepo(collection, this.REPO_NAME, this.MODEL_ROLE_NAME, domain);
	}

	public static getInstance(say: MessengerFunction): ActionRepo {
		return super.getInstance(say) as ActionRepo;
	}

	public async getActionIdByName(name: string): Promise<string> {
		const query = { "data.name": name };
		const projection = { projection: { _id: 1 }};
		const actionCore : { _id: ObjectId } = await this.collection.findOne(query, projection);
		return actionCore?._id.toString();
	}

	public async addDefaultData(say: MessengerFunction): Promise<OperationStatus> {
		const count = await this.collection.count({});
		if (count > 0) return "success";

		const actionCores = getDefaultData(this.domain);
		return this.collection.insertMany(actionCores);
	}

}

export { ActionRepo };
