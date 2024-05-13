import { Router as ExpRouter } from "express";

import { MessengerFunction } from "../Messenger";
import { Router } from "../network/Router";
import { RawRoutesInfo } from "../network/types/RoutesInfo";
import ApiController from "./ApiController";

class ApiRouter extends Router {
	constructor(router: ExpRouter, controller: ApiController, routes: RawRoutesInfo, msngr: MessengerFunction) {
		super(router, controller, routes, msngr);
	}

	static create(expRouter: ExpRouter, routes: RawRoutesInfo, say: MessengerFunction): ApiRouter {
		let controller = new ApiController(say);
		return new ApiRouter(expRouter, controller, routes, say);
	}
}

export default ApiRouter;
