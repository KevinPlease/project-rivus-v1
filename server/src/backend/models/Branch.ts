import { MessengerFunction } from "../../Messenger";
import { Model, ModelCore } from "../../core/Model";
import Metadata from "../../core/types/Metadata";
import OwnershipInfo from "../types/OwnershipInfo";
import { BaseRepo } from "../repos/BaseRepo";
import { BranchRepo } from "../repos/BranchRepo";

type BranchData = {
	isDraft?: boolean;
	name: string,
	owner: string
};

class Branch extends Model<BranchData> {
	
	static ROLE = "branch";

	constructor(core: ModelCore<BranchData>) {
		super(core);
	}

	public static create(say: MessengerFunction, data: BranchData, ownership: OwnershipInfo, meta?: Metadata): Branch {
		return Model._create(say, data, BranchRepo.REPO_NAME, Branch.ROLE, { domain:  ownership.domain }, meta);
	}
	
	public static byRepoId(branchId: string, say: MessengerFunction) : Branch {
		return say(this, "ask", "branchById", branchId);
	}

}

export { Branch };
export type { BranchData };


