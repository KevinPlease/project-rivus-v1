import { MessengerFunction } from "../Messenger";
import { RequestAuthInfo } from "./types/RequestAuthInfo";
import IAuthorizer from "./interfaces/IAuthorizer";
import { AuthResponse } from "./types/AuthResponse";
import { BranchRepo } from "../backend/repos/BranchRepo";

class BranchAuthorizer implements IAuthorizer {
	
	async checkAuthorization(info: RequestAuthInfo, say: MessengerFunction): Promise<AuthResponse> {
		let isAuthorized: boolean = true;
		let content: string | undefined;
		
		const branchRepo = BranchRepo.getInstance(say);
		const branchExists = await branchRepo.isBranchPresent(info.branchName);
		if (!branchExists) {
			isAuthorized = false;
			content = "Invalid branch name!";
		}

		return { isAuthorized, content };
	}

}

export { BranchAuthorizer };
