import { MessengerFunction } from "../Messenger";

export default {
	
	rootOf: (appendix: string, say: MessengerFunction): string => {
		return say("Path", "ask", "rootPathOf", appendix);
	}
	
}