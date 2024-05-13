import { ObjectId } from "mongodb";
import { ExString } from "../../shared/String";
import { AccessType } from "../types/Access";

const getDefaultData = (domain: string) => {
	domain = ExString.uncapitalize(domain);
	return [
		{
			"_id": new ObjectId("64b877be20a24bc2e25db5b8"),
			"repository": `roles@${domain}`,
			"role": "role",
			"data": {
				"name": "General Manager",
				"description": "All Access",
				"actions": [
					"64b877be20a24bc2e25db596",
					"64b877be20a24bc2e25db597",
					"64b877be20a24bc2e25db598",
					"64b877be20a24bc2e25db599",
					"64b877be20a24bc2e25db59a",
					"64b877be20a24bc2e25db59b",
					"64b877be20a24bc2e25db59c",
					"64b877be20a24bc2e25db59d",
					"64de9f0053f071842e689392",
					"64deacdbf401114920c1dc6a"
				]
				,
				"accessInfo": {
					"global": {
						"user": {
							"read": AccessType.OVERSEER,
							"write": AccessType.OVERSEER
						}
					},
					"fieldAccess": {
						"user": {
							"isDraft": {
								"read": AccessType.SELFISH,
								"write": AccessType.SELFISH
							},
							"name": {
								"read": AccessType.SELFISH,
								"write": AccessType.SELFISH
							},
							"role": {
								"read": AccessType.SELFISH,
								"write": AccessType.SELFISH
							},
							"details.image": {
								"read": AccessType.SELFISH,
								"write": AccessType.SELFISH
							},
							"details.email": {
								"read": AccessType.SELFISH,
								"write": AccessType.SELFISH
							},
							"details.username": {
								"read": AccessType.SELFISH,
								"write": AccessType.SELFISH
							},
							"details.password": {
								"read": AccessType.SELFISH,
								"write": AccessType.SELFISH
							},
							"details.phone": {
								"read": AccessType.SELFISH,
								"write": AccessType.SELFISH
							},
							"details.token": {
								"read": AccessType.SELFISH,
								"write": AccessType.SELFISH
							},
							"roles": {
								"read": AccessType.SELFISH,
								"write": AccessType.SELFISH
							}
						}
					}
				}
			},
			"meta": {
				"timeCreated": 1715626111,
				"timeUpdated": 1715626111,
				"creator": ""
			}
		},
		{
			"_id": new ObjectId("6616d1dcf8c2ebe045265e5d"),
			"repository": `roles@${domain}`,
			"role": "role",
			"data": {
				"accessInfo": {
					"global": {
						"user": {
							"read": AccessType.SELFISH,
							"write": AccessType.SELFISH
						}
					},
					"fieldAccess": {
						"user": {
							"roles": {
								"read": AccessType.SELFISH,
								"write": AccessType.SELFISH
							}
						}
					}
				},
				"actions": [
					"64b877be20a24bc2e25db596",
					"64b877be20a24bc2e25db597",
					"64b877be20a24bc2e25db598",
					"64b877be20a24bc2e25db599",
					"64b877be20a24bc2e25db59a",
					"64b877be20a24bc2e25db59b",
					"64b877be20a24bc2e25db59c",
					"64b877be20a24bc2e25db59d",
					"64de9f0053f071842e689392",
					"64deacdbf401114920c1dc6a"
				]
				,
				"description": "Default Role",
				"name": "Default Role"
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
