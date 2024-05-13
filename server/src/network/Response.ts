import { Response as ExpResponse } from "express";

import { Functions, OperationStatus } from "../shared/Function";
import ObjOverride from "../shared/Object";
import { ExString } from "../shared/String";
import { Communicator } from "../communications/Communicator";
import { Dictionary } from "../types/Dictionary";
import { MessengerFunction } from "../Messenger";

type ResponseTypes =
	"success" |
	"successFile" |
	"noContent" |
	"redirection" |
	"badRequest" |
	"unauthorized" |
	"forbidden" |
	"notFound" |
	"serverError";

const CODE_FOR_TYPE = {
	success: 200,
	successFile: 200,
	noContent: 204,
	redirection: 307,
	badRequest: 400,
	unauthorized: 401,
	forbidden: 403,
	notFound: 404,
	serverError: 500
};

class Response<Data> extends Communicator {
	private _res: ExpResponse;
	private _resMethod: string;
	private _status: number;
	public content?: Data;

	constructor(status: number, res: ExpResponse, content?: Data) {
		super();

		this._res = res;
		this._resMethod = "json";
		this._status = status;
		this.content = content;
	}

	static isNotSuccessful(res: ExpResponse): boolean { return res.statusCode !== 200 }

	static success<Data>(res: ExpResponse, content?: Data): Response<Data> { return new Response(CODE_FOR_TYPE.success, res, content) }
	static successFile<Data>(res: ExpResponse, content?: Data) {
		let response = Response.success<Data>(res, content);
		response._resMethod = "sendFile";
		return response;
	}
	static noContent<Data>(res: ExpResponse, content?: Data) { return new Response<Data>(CODE_FOR_TYPE.noContent, res, content) }
	static redirection<Data>(res: ExpResponse, content?: Data) { return new Response<Data>(CODE_FOR_TYPE.redirection, res, content) }
	static badRequest<Data>(res: ExpResponse, content?: Data) { return new Response<Data>(CODE_FOR_TYPE.badRequest, res, content) }
	static unauthorized<Data>(res: ExpResponse, content?: Data) { return new Response<Data>(CODE_FOR_TYPE.unauthorized, res, content) }
	static forbidden<Data>(res: ExpResponse, content?: Data) { return new Response<Data>(CODE_FOR_TYPE.forbidden, res, content) }
	static notFound<Data>(res: ExpResponse, content?: Data) { return new Response<Data>(CODE_FOR_TYPE.notFound, res, content) }
	static serverError<Data>(res: ExpResponse, content?: Data) { return new Response<Data>(CODE_FOR_TYPE.serverError, res, content) }

	public static sendPartial(content: string, say: MessengerFunction) {
		const res: ExpResponse = say(this, "ask", "response");
		const headersSent = res.getHeaders();
		if (headersSent["content-type"] !== "text/event-stream") {
			const headers = {
				"Content-Type": "text/event-stream",
				"Connection": "keep-alive",
				"Cache-Control": "no-cache",
				"X-Accel-Buffering": "no"
			};
			res.writeHead(200, headers);
		}
		
		res.write(`data: ${content}\n\n`);
	}

	public end() { this._res.end() }

	public sendByInfo(operationStatus: OperationStatus, content?: Data): void {
		let type: ResponseTypes;
		let contentToSend = content;
		if (operationStatus === "failure") {
			type = "badRequest";
			contentToSend = undefined;
		} else {
			type = "success";
		}

		this
			.setType(type)
			.content = contentToSend;
		return this.send();
	}

	public sendFileByInfo(operationStatus: OperationStatus, content?: Data): void {
		let type: ResponseTypes;
		let contentToSend = content;
		if (operationStatus === "failure") {
			type = "badRequest";
			contentToSend = undefined;
		} else {
			type = "successFile";
		}

		this
			.setType(type)
			.content = contentToSend;
		return this.send();
	}

	public setType(type: ResponseTypes): Response<Data> {
		this._status = CODE_FOR_TYPE[type];
		if (type === "successFile") this._resMethod = "sendFile";
		return this;
	}

	send(): void {
		const status = this._status;
		this._res.status(status);

		const resMethod = this._resMethod;
		const content = resMethod === "sendFile" ? this.content : { status, content: this.content };

		const result = Functions.doTryCatch(this._res, this._resMethod, content);
		if (result === null) return Response.serverError(this._res, "WIP").send();

		this.dispatch("api logging");
	}

	redirect(url: string): Response<Data> {
		this.dispatch("api logging");
		this._res.redirect(this._res.statusCode, url);
		return this;
	}

	getTerseLog(session: number): string {
		let status = this._res.statusCode;
		// let fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
		let fullUrl = "WIP: URL HERE";
		// let body = req.body;
		let body = {};
		if (body instanceof Object) {
			body = ObjOverride.firstLevelOf(body);
		}
		body = JSON.stringify(body);

		return ExString.removeTabs(`Session: ${session}
	status: ${status}
	url: ${fullUrl}
	body: ${body}
	`);
	}

	getVerboseLog(session: number): string {
		let res = this._res;
		// let fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
		let fullUrl = "WIP: URL HERE";
		// let reqHeaders = JSON.stringify(req.headers);
		let reqHeaders = "WIP: REQHEADERS HERE";
		let resHeaders = JSON.stringify(res.getHeaderNames());
		let status = res.statusCode;
		// let body = JSON.stringify(req.body);
		let body = "WIP: REQBODY HERE";

		return ExString.removeTabs(`Session: ${session}
	url: 	${fullUrl}
	head: 	${reqHeaders}
	stat: 	${status}
	head: 	${resHeaders}
	body: 	${body}
	`);
	}
}

export { Response };
export type { ResponseTypes };

