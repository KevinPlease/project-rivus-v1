import { MessengerFunction } from "../../Messenger";
import { Dictionary } from "../../types/Dictionary";
import { RepoAccess } from "../types/Access";

interface IRepoMiddleware {
	
	validateUpdateQuery(id: string, query: Dictionary, role: string, say: MessengerFunction): Promise<Dictionary | null>;
	
	validateCreateQuery(query: Dictionary, role: string, say: MessengerFunction): Promise<Dictionary | null>;
	
	getAccessInfo(say: MessengerFunction): Promise<RepoAccess | null>;

}

export default IRepoMiddleware;
