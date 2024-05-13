import { MessengerFunction } from "../Messenger";
import { RequestAuthInfo } from "./types/RequestAuthInfo";
import IAuthorizer from "./interfaces/IAuthorizer";
import { AuthResponse } from "./types/AuthResponse";
import { Domain } from "../backend/models/Domain";

class DomainAuthorizer implements IAuthorizer {
	
	async checkAuthorization(info: RequestAuthInfo, say: MessengerFunction): Promise<AuthResponse> {
		let isAuthorized: boolean = true;
		let content: string | undefined;
		
		const domain = info.domainName && Domain.byName(info.domainName, say);
		if (!domain) {
			isAuthorized = false;
			content = "Invalid domain!";
		}

		return { isAuthorized, content };
	}

}

export { DomainAuthorizer };
