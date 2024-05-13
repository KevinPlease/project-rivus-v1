import { Model } from "../../core/Model";
import Metadata from "../../core/types/Metadata";
import { MessengerFunction } from "../../Messenger";
import { RoleRepo } from "../repos/RoleRepo";
import { Access, AccessType } from "../types/Access";
import OwnershipInfo from "../types/OwnershipInfo";
import { User } from "./User";

type RoleData = {
	isDraft?: boolean;
	actions: string[];
	description: string;
	name: string;
	accessInfo: Access;
};

class Role extends Model<RoleData> {

	public static ROLE = "role";
	public static PUBLIC = "guest";

	public static create(say: MessengerFunction, data: RoleData, ownership: OwnershipInfo, meta?: Metadata): Role {
		return Model._create(say, data, RoleRepo.REPO_NAME, Role.ROLE, { domain: ownership.domain }, meta);
	}

	public static defaultAccessInfo(): Access {
		return {
			global: {
				[User.ROLE]: {
					read: AccessType.SELFISH,
					write: AccessType.SELFISH
				}
			},
			fieldAccess: {
				[User.ROLE]: {
					"isDraft": {
						read: AccessType.SELFISH,
						write: AccessType.SELFISH
					},
					"name": {
						read: AccessType.SELFISH,
						write: AccessType.SELFISH
					},
					"role": {
						read: AccessType.SELFISH,
						write: AccessType.SELFISH
					},
					"roles": {
						read: AccessType.SELFISH,
						write: AccessType.SELFISH
					},
					"image": {
						read: AccessType.SELFISH,
						write: AccessType.SELFISH
					},
					"email": {
						read: AccessType.SELFISH,
						write: AccessType.SELFISH
					},
					"username": {
						read: AccessType.MISS,
						write: AccessType.MISS
					},
					"password": {
						read: AccessType.SELFISH,
						write: AccessType.SELFISH
					},
					"phone": {
						read: AccessType.SELFISH,
						write: AccessType.SELFISH
					},
					"token": {
						read: AccessType.SELFISH,
						write: AccessType.SELFISH
					}
				}
			}
		};
	}

	public static defaultActions(): string[] {
		return [
			"64b877be20a24bc2e25db596", "64b877be20a24bc2e25db597", "64b877be20a24bc2e25db598", "64b877be20a24bc2e25db59f",
			"64b877be20a24bc2e25db5a0", "64b877be20a24bc2e25db5a1", "64b877be20a24bc2e25db5a2", "64b877be20a24bc2e25db5a3",
			"64b877be20a24bc2e25db5a4", "64b877be20a24bc2e25db5a5", "64b877be20a24bc2e25db5a6", "64b877be20a24bc2e25db5a8",
			"64b877be20a24bc2e25db5a9", "64b877be20a24bc2e25db5aa", "64b877be20a24bc2e25db5ab", "64b877be20a24bc2e25db5ad",
			"64b877be20a24bc2e25db5ae", "64b877be20a24bc2e25db5af", "64b877be20a24bc2e25db5b0", "64b877be20a24bc2e25db5b1",
			"64b877be20a24bc2e25db5b2", "64b877be20a24bc2e25db5b3", "64b877be20a24bc2e25db5b4", "64b877be20a24bc2e25db5b6",
			"64badd0a966a1c35ed617a62", "64badd12966a1c35ed617a64", "64ca96478078a186ce3aa02b", "64ca96988078a186ce3aa030",
			"64ca96ae8078a186ce3aa032", "64ca96bf8078a186ce3aa034", "64ca96d48078a186ce3aa036", "64de9f0053f071842e689392",
			"64deacdbf401114920c1dc6a", "64ef8c83a1773927bb4d5f03"
		];
	}

	public static defaultData(): RoleData {
		return {
			accessInfo: Role.defaultAccessInfo(),
			actions: Role.defaultActions(),
			description: "Default Role",
			name: "Default Role"
		};
	}

}

export { Role };
export type { RoleData };
