import { RoleRepo } from "../backend/repos/RoleRepo";
import { MessengerFunction } from "../Messenger";
import { RequestAuthInfo } from "./types/RequestAuthInfo";
import IAuthorizer from "./interfaces/IAuthorizer";
import { AuthResponse } from "./types/AuthResponse";
import { UserRepo } from "../backend/repos/UserRepo";

class RoleAuthorizer implements IAuthorizer {
	
	async checkAuthorization(info: RequestAuthInfo, say: MessengerFunction): Promise<AuthResponse> {
		let isAuthorized: boolean;
		let content: string | undefined;

		const userRepo = UserRepo.getInstance(say);
		const user = await userRepo.findUserByToken(info.authToken, say);
		if (user) {
			const roleRepo = RoleRepo.getInstance(say);
			const roleId = user.model.data.roles[info.branchName];
			isAuthorized = await roleRepo.isActionPresent(info.actionId, roleId);
		} else {
			isAuthorized = false;
			content = "You do not have the required permissions!";
		}

		return { isAuthorized, content };
	}

}

export { RoleAuthorizer };
