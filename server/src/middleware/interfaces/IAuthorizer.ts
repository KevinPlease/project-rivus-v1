import { MessengerFunction } from "../../Messenger";
import { RequestAuthInfo } from "../types/RequestAuthInfo";
import { AuthResponse } from "../types/AuthResponse";

interface IAuthorizer {
	
	checkAuthorization(data: RequestAuthInfo, say: MessengerFunction): Promise<AuthResponse>;

}

export default IAuthorizer;
