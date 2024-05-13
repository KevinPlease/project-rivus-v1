import { MessengerFunction } from "../../Messenger";
import { Model } from "../../core/Model";
import { ExString } from "../../shared/String";
import { Dictionary } from "../../types/Dictionary";
import IRepoMiddleware from "../interfaces/IRepoMiddleware";
import { Branch } from "../models/Branch";
import { RoleRepo } from "../repos/RoleRepo";
import { AccessType, FieldAccess, RepoAccess } from "../types/Access";

class PrivilegeKeeper implements IRepoMiddleware {

	private static _excludedFields = ["roles", "hunt"];

	private static createData(query: Dictionary, fieldAccess: FieldAccess, parentPath?: string): Dictionary {
		let data = {};

		const excludedFields = this._excludedFields;
		for (const fieldName in query) {
			let curParentPath = parentPath ? parentPath + "." + ExString.deprefix(fieldName, "data.") : fieldName;
			let fieldNameInAccess = ExString.deprefix(curParentPath, "data.");
			curParentPath = ExString.betweenFirstTwo(fieldNameInAccess, ".") || fieldNameInAccess;
			const accessType = fieldAccess[fieldNameInAccess]?.write;
			
			let value = query[fieldName];
			if (typeof value === "object" && !excludedFields.includes(fieldName)) {
				if (!Array.isArray(value) && !value.from && !value.to) {
					value = PrivilegeKeeper.createData(value, fieldAccess, curParentPath);
					data[curParentPath] = value;
					continue;
				}
			}

			const allowData = accessType === AccessType.OVERSEER || accessType === AccessType.SELFISH || fieldName.startsWith("meta.");
			if (!allowData) continue;

			data[fieldName] = value;
		}

		return data;
	}

	private static createUpdateData(query: Dictionary, fieldAccess: FieldAccess, parentPath?: string): Dictionary {
		let data = {};

		const excludedFields = this._excludedFields;
		for (const fieldName in query) {
			let fieldNameInAccess = ExString.deprefix(fieldName, "data.");
			fieldNameInAccess = ExString.desuffix(fieldNameInAccess, ".from");
			fieldNameInAccess = ExString.desuffix(fieldNameInAccess, ".to");
			let accessType = fieldAccess[fieldNameInAccess]?.write;
			if (!accessType) accessType = fieldAccess[ExString.upToBefore(fieldNameInAccess, ".")]?.write;
			
			let value = query[fieldName];
			if (!excludedFields.includes(fieldName)) {
				const allowData = accessType === AccessType.OVERSEER || accessType === AccessType.SELFISH || fieldName.startsWith("meta.");
				if (!allowData) continue;
				
			}

			data[fieldName] = value;
		}

		return data;
	}

	public static findPrivileges(say: MessengerFunction) {
		const userId: string = say(this, "ask", "ownUserId");
		const roleRepo = RoleRepo.getInstance(say);
		return roleRepo.getPrivileges(userId, say);
	}

	public async validateCreateQuery(model: Model<Dictionary>, role: string, say: MessengerFunction): Promise<Dictionary | null> {
		const repoAccess = await this.getAccessInfo(say);
		if (!repoAccess) {
			console.info("PrivilegeKeeper: Missing Access...");
			return null;
		}

		const ownBranch: Branch = say(this, "ask", "ownBranch");
		const accessInfo = repoAccess[ownBranch.data.name];
		const writeAccess = accessInfo.global[role].write;
		if (writeAccess !== AccessType.OVERSEER && writeAccess !== AccessType.SELFISH) return null;

		const fieldAccess = accessInfo.fieldAccess[role];
		const newData = PrivilegeKeeper.createData(model.data, fieldAccess);
		const modelCore = model.toNoIdJSON();
		modelCore.data = newData;
		return modelCore;
	}


	public async validateUpdateQuery(id: string, query: Dictionary, role: string, say: MessengerFunction): Promise<Dictionary | null> {
		const repoAccess = await this.getAccessInfo(say);
		if (!repoAccess) {
			console.info("PrivilegeKeeper: Missing Access...");
			return null;
		}

		const ownBranch: Branch = say(this, "ask", "ownBranch");
		const accessInfo = repoAccess[ownBranch.data.name];
		const writeAccess = accessInfo.global[role].write;
		if (writeAccess !== AccessType.OVERSEER && writeAccess !== AccessType.SELFISH) return null;

		const fieldAccess = accessInfo.fieldAccess[role];
		if (query instanceof Model) {
			const newData = PrivilegeKeeper.createData(query.data, fieldAccess);
			query.data = newData;
			return query;

		} else {
			return PrivilegeKeeper.createUpdateData(query, fieldAccess);
		}

	}

	public getAccessInfo(say: MessengerFunction): Promise<RepoAccess | null> {
		return PrivilegeKeeper.findPrivileges(say);
	}

}

export default PrivilegeKeeper;
