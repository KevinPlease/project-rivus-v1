import { Router as ExpRouter } from "express";

import { MessengerFunction } from "../Messenger";
import { Router } from "../network/Router";
import { RawRoutesInfo } from "../network/types/RoutesInfo";
import { AdminController } from "./AdminController";

class AdminRouter extends Router {
	constructor(router: ExpRouter, controller: AdminController, routes: RawRoutesInfo, msngr: MessengerFunction) {
		super(router, controller, routes, msngr);
	}

	static create(expRouter: ExpRouter, routes: RawRoutesInfo, say: MessengerFunction): AdminRouter {
		let controller = new AdminController(say);
		return new AdminRouter(expRouter, controller, routes, say);
	}
}

export { AdminRouter };
