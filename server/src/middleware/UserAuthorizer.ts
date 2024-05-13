import { MessengerFunction } from "../Messenger";
import { RequestAuthInfo } from "./types/RequestAuthInfo";
import IAuthorizer from "./interfaces/IAuthorizer";
import { AuthResponse } from "./types/AuthResponse";

class UserAuthorizer implements IAuthorizer {
	
	async checkAuthorization(info: RequestAuthInfo, say: MessengerFunction): Promise<AuthResponse> {
		let isAuthorized: boolean;
		let content: string | undefined;

		if (info.needsAuth === false) {
			isAuthorized = true;
		} else {
			const userInfo = await say(this, "ask", "infoFromToken", info.authToken);
			isAuthorized = userInfo ? true : false;
			if (isAuthorized) {
				const expRequest = say(this, "ask", "request");
				expRequest.user = userInfo;
			} else {
				content = "Authorization failed for your token!";
			}
		}


		return { isAuthorized, content };
	}

}

export { UserAuthorizer };
