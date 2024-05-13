import { ObjectId } from "mongodb";
import { ExString } from "../../shared/String";

const getDefaultData = (domain: string) => {
	domain = ExString.uncapitalize(domain);
	return [
		{
			"_id": new ObjectId("64b877be20a24bc2e25db596"),
			"repository": `actions@${domain}_sys`,
			"role": "action",
			"data": {
				"name": "Public Action",
				"description": "No special privileges."
			},
			"meta": {
				"timeCreated": 1715626111,
				"timeUpdated": 1715626111,
				"creator": ""
			}
		},
		{
			"_id": new ObjectId("64b877be20a24bc2e25db597"),
			"repository": `actions@${domain}_sys`,
			"role": "action",
			"data": {
				"name": "CRUD Actions",
				"description": "CRUD operations on System Actions."
			},
			"meta": {
				"timeCreated": 1715626111,
				"timeUpdated": 1715626111,
				"creator": ""
			}
		},
		{
			"_id": new ObjectId("64b877be20a24bc2e25db598"),
			"repository": `actions@${domain}_sys`,
			"role": "action",
			"data": {
				"name": "Get Form Details",
				"description": ""
			},
			"meta": {
				"timeCreated": 1715626111,
				"timeUpdated": 1715626111,
				"creator": ""
			}
		},
		{
			"_id": new ObjectId("64b877be20a24bc2e25db599"),
			"repository": `actions@${domain}_sys`,
			"role": "action",
			"data": {
				"name": "Add User",
				"description": "Add a user in the database."
			},
			"meta": {
				"timeCreated": 1715626111,
				"timeUpdated": 1715626111,
				"creator": ""
			}
		},
		{
			"_id": new ObjectId("64b877be20a24bc2e25db59a"),
			"repository": `actions@${domain}_sys`,
			"role": "action",
			"data": {
				"name": "Get User",
				"description": ""
			},
			"meta": {
				"timeCreated": 1715626111,
				"timeUpdated": 1715626111,
				"creator": ""
			}
		},
		{
			"_id": new ObjectId("64b877be20a24bc2e25db59b"),
			"repository": `actions@${domain}_sys`,
			"role": "action",
			"data": {
				"name": "Get Users",
				"description": ""
			},
			"meta": {
				"timeCreated": 1715626111,
				"timeUpdated": 1715626111,
				"creator": ""
			}
		},
		{
			"_id": new ObjectId("64b877be20a24bc2e25db59c"),
			"repository": `actions@${domain}_sys`,
			"role": "action",
			"data": {
				"name": "Edit User",
				"description": ""
			},
			"meta": {
				"timeCreated": 1715626111,
				"timeUpdated": 1715626111,
				"creator": ""
			}
		},
		{
			"_id": new ObjectId("64b877be20a24bc2e25db59d"),
			"repository": `actions@${domain}_sys`,
			"role": "action",
			"data": {
				"name": "Remove User",
				"description": ""
			},
			"meta": {
				"timeCreated": 1715626111,
				"timeUpdated": 1715626111,
				"creator": ""
			}
		},
		{
			"_id": new ObjectId("64de9f0053f071842e689392"),
			"repository": `actions@${domain}_sys`,
			"role": "action",
			"data": {
				"name": "Add User Images",
				"description": ""
			},
			"meta": {
				"timeCreated": 1715626111,
				"timeUpdated": 1715626111,
				"creator": ""
			}
		},
		{
			"_id": new ObjectId("64deacdbf401114920c1dc6a"),
			"repository": `actions@${domain}_sys`,
			"role": "action",
			"data": {
				"name": "Edit Own User",
				"description": ""
			},
			"meta": {
				"timeCreated": 1715626111,
				"timeUpdated": 1715626111,
				"creator": ""
			}
		}
	]
}

export { getDefaultData };
