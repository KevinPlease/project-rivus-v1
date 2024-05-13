import { MessengerFunction } from "../../Messenger";
import { Model } from "../../core/Model";
import ExObject from "../../shared/Object";
import Metadata from "../../core/types/Metadata";
import OwnershipInfo from "../types/OwnershipInfo";
import { ImageDetails } from "../types/ImageDetails";
import { GenericDictionary } from "../../types/Dictionary";
import { Role } from "./Role";

type BranchRole = GenericDictionary<string>;

type UserPreferences = {};

type UserData = {
	isDraft?: boolean;
	name: string;
	role: Role | null;
	roles: BranchRole;
	image: ImageDetails
	email: string;
	username: string;
	password: string;
	phone: string;
	token?: string;
	preferences: UserPreferences;
};

type UserFormDetails = {
	role: any[];
	branch: any[];
}

class User extends Model<UserData> {

	static ROLE = "user";

	static emptyData(): UserData {
		return {
			isDraft: true,
			name: "",
			role: null,
			roles: {},
			image: {
				file: {
					name: "",
					size: 0,
					type: ""
				},
				alt: "",
				src: "",
				url: "",
				isImg: true,
				id: "",
				fsPath: ""
			},
			username: "",
			email: "",
			password: "",
			phone: "",
			token: "",
			preferences: {}
		};
	}

	public static create(say: MessengerFunction, data: UserData, ownership: OwnershipInfo, meta?: Metadata): User {
		if (ExObject.isDictEmpty(data)) data = User.emptyData();

		if (!ownership.branch) throw "USER: Missing branch from ownership info!";

		// NOTE: cyclic dependency if importing UserRepo, therefore we use direct dependency injection
		const userRepo = say(this, "ask", "repo", "users");
		return Model._create(say, data, userRepo.repoName, User.ROLE, ownership, meta);
	}

}

export { User };
export type { UserData, UserFormDetails };
