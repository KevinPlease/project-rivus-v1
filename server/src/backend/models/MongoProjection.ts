import { Dictionary } from "../../types/Dictionary";
import { Access } from "../types/Access";

class MongoProjection {	

	public static fromAccessInfo(info: Access): Dictionary {
		const projection = {};
		
		for (const fieldName in info) {
			const accessType = info[fieldName];
			
		}

		return projection;
	}

}

export default MongoProjection;
