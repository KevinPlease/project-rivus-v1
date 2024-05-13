import { Dictionary } from "../types/Dictionary";
import JSONOverride from "../shared/Json";
import { MessengerFunction } from "../Messenger";
import { MExpRequest } from "./types/MExpRequest";
import { FileInfo } from "../files/types/FileInfo";

type MethodType = "post" | "get" | "put" | "delete" | "patch" | "options";

class Request<Data extends Dictionary> {
	private _headers: Dictionary;
	private _body: Data;
	private _query: Data;
	private _path: string;
	private _params: Dictionary;
	private _method: MethodType;
	
	constructor(headers: Dictionary, body: Data, query: Dictionary, path: string, params: Dictionary, method: MethodType) {
		this._headers = headers;
		this._body = body;
		
		const parsedQuery = {};
		for (const key in query) {
			const element = query[key];
			const decodedElement = decodeURIComponent(element);
			parsedQuery[key] = JSONOverride.safeParse(decodedElement);
		}

		this._query = parsedQuery as Data;
		this._path = path;
		this._params = params;
		this._method = method;
	}

	public get body(): Data { return this._body	}
	public get query(): Data { return this._query }
	public get params(): Dictionary { return this._params }

	public getUploadedFiles(say: MessengerFunction): FileInfo[] {
		const expReq: MExpRequest = say(this, "ask", "request");
		return expReq.uploadedFiles || [];
	}

}

export { Request };
export type { MethodType };
