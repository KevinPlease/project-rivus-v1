import { Model } from "../../core/Model";
import { MessengerFunction } from "../../Messenger";
import Metadata from "../../core/types/Metadata";
import OwnershipInfo from "../types/OwnershipInfo";
import { ActionRepo } from "../repos/ActionRepo";

type ActionData = {
	isDraft?: boolean,
	description: string,
	name: string
};

class Action extends Model<ActionData> {

	static ROLE = "action";

	public static create(say: MessengerFunction, data: ActionData, ownership: OwnershipInfo, meta?: Metadata): Action {
		return Model._create(say, data, ActionRepo.REPO_NAME, Action.ROLE, { domain: ownership.domain }, meta);
	}

}

export { Action };
export type { ActionData };
