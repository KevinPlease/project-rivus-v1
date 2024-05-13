import { MessengerFunction } from "../Messenger";
import IdCreator from "../backend/IdCreator";
import OwnershipInfo from "../backend/types/OwnershipInfo";
import { Communicator } from "../communications/Communicator";
import ExObject from "../shared/Object";
import { ExString } from "../shared/String";
import { Dictionary } from "../types/Dictionary";
import Metadata from "./types/Metadata";

interface BasicCore<Data> {
	_id: string;
	data: Data;
}

interface ModelCore<Data> {
	_id?: string;
	totalCount?: number;
	displayId?: string;
	repository: string;
	role: string;
	data: Data;
	meta: Metadata;
}

class Model<Data extends Dictionary> extends Communicator {
	static ROLE: string;
	private _core: ModelCore<Data>;

	constructor(core: ModelCore<Data>) {
		super();

		// runtime dynamic variables can go here -- caches etc.
		this._core = core;
		if (!this._core.meta) {
			const time = Date.now();
			this._core.meta = {
				timeCreated: time,
				timeUpdated: time,
				creator: ""
			};
		}
	}

	public static _create<Data extends Dictionary>(say: MessengerFunction, data: Data, repoName: string, role: string, ownership?: OwnershipInfo, meta?: Metadata): Model<Data> {
		let repository = "";
		if (ownership) {
			const { branch, domain } = ownership;
			repository = branch ? IdCreator.createBranchedRepoId(repoName, branch, domain) : IdCreator.createRepoId(repoName, domain);
		} else {
			repository = repoName;
		}

		const now = Date.now();
		const creator = say(this, "ask", "ownUserId");
		if (!meta) meta = { timeCreated: now, timeUpdated: now, creator };

		const core: ModelCore<Data> = { repository, role, data, meta };
		return new Model(core);
	}

	public get repository(): string { return this._core.repository }
	public get role(): string { return this._core.role }
	public get data(): Data { return this._core.data }
	public get meta(): Metadata { return this._core.meta || { timeCreated: 0, timeUpdated: 0 } }

	public get id(): string {
		const id = this._core._id;
		if (!id) return "";

		return id.toString ? id.toString() : id;
	}
	public set id(newId: string) { this._core._id = newId }
	public get displayId() { return this._core.displayId || "" }
	public set displayId(newId: string) { this._core.displayId = newId }
	public set data(newData: Data) { this._core.data = newData }

	public getDomainName(): string {
		return ExString.sinceAfterLast(this.repository, "@");
	}

	public getBranchName(): string {
		return ExString.betweenFirstTwo(this.repository, "/", "@");
	}

	// public toBSON(): Dictionary { return this._core }
	public toJSON(): ModelCore<Data> {
		const coreClone = ExObject.cloneDeeply(this._core) as ModelCore<Data>;
		coreClone._id = this._core._id;
		return coreClone;
	}

	public toNoIdJSON(): Dictionary {
		const coreClone = ExObject.cloneDeeply(this._core) as ModelCore<Data>;
		delete coreClone._id;
		return coreClone;
	}

}

export { Model };
export type { BasicCore, ModelCore };