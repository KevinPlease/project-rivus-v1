import Controller from "../network/Controller";
import { MessengerFunction } from "../Messenger";
import { Response, ResponseTypes } from "../network/Response";
import { Dictionary } from "../types/Dictionary";
import { ActionRepo } from "../backend/repos/ActionRepo";
import { Action, ActionData } from "../backend/models/Action";
import { IdentifiableDictionary } from "../types/IdentifiableDictionary";
import { BasicCore } from "../core/Model";

class AdminController extends Controller {
	
	async postActions(say: MessengerFunction) : Promise<void> {
		const request = this.getActiveRequest<ActionData[]>(say);
		const response = this.getActiveResponse<Dictionary>(say);

		const actionRepo = ActionRepo.getInstance(say);
		const actionOperation = await actionRepo.addMany(request.body, say);

		let type: ResponseTypes;
		let content = {};
		if (actionOperation === "failure") {
			type = "badRequest";
		} else {
			type = "success";
			content = {};
		}

		response
			.setType(type)
			.content = content;
		return response.send();
	}

	async postAction(say: MessengerFunction): Promise<void> {
		const request = this.getActiveRequest<ActionData>(say);
		const response: Response<any> = this.getActiveResponse<Dictionary>(say);
		const domain = this.getOwningDomain(say);
		if (!domain) {
			response.content = { error: "Missing subdomain" };
			return response.setType("badRequest").send();
		}
		
		const actionRepo = ActionRepo.getInstance(say);
		const action = Action.create(say, request.body, { domain: domain.name });
		const status = await actionRepo.add(action, say);
		const responseType = status === "failure" ? "serverError" : "success";

		return response
			.setType(responseType)
			.send();
	}

	async putAction(say: MessengerFunction): Promise<void> {
		const request = this.getActiveRequest<BasicCore<ActionData>>(say);
		const response: Response<any> = this.getActiveResponse<Dictionary>(say);
		const domain = this.getOwningDomain(say);
		if (!domain) {
			response.content = { error: "Missing subdomain" };
			return response.setType("badRequest").send();
		}
		
		const actionRepo = ActionRepo.getInstance(say);
		const action = Action.create(say, request.body.data, { domain: domain.name });
		const status = await actionRepo.edit(request.body._id, action, say);
		const responseType = status === "failure" ? "serverError" : "success";

		return response
			.setType(responseType)
			.send();
	}

	async deleteAction(say: MessengerFunction): Promise<void> {
		const request = this.getActiveRequest<IdentifiableDictionary>(say);
		const response: Response<any> = this.getActiveResponse<Dictionary>(say);
		const domain = this.getOwningDomain(say);
		if (!domain) {
			response.content = { error: "Missing subdomain" };
			return response.setType("badRequest").send();
		}
		
		const actionRepo = ActionRepo.getInstance(say);
		const status = await actionRepo.remove(request.body.id, say);
		const responseType = status === "failure" ? "serverError" : "success";

		return response
			.setType(responseType)
			.send();
	}

	async getAction(say: MessengerFunction): Promise<void> {
		const request = this.getActiveRequest<IdentifiableDictionary>(say);
		const response: Response<any> = this.getActiveResponse<Dictionary>(say);
		
		const actionRepo = ActionRepo.getInstance(say);
		const action = await actionRepo.findById(request.query.id, say);
		const responseType = action ? "success" : "notFound";

		response
			.setType(responseType)
			.content = action;

		return response.send();
	}

}

export { AdminController };
