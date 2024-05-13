import UrlUtils from "url";
import Folder from "../files/Folder";
const __root = UrlUtils.fileURLToPath(new UrlUtils.URL("../", import.meta.url));

import { MessengerFunction } from "../Messenger";
import { Functions } from "../shared/Function";
import { Dictionary } from "../types/Dictionary";
import WorkDependency from "./types/WorkDependency";
import Work from "./Work";

class WorkerEngine<ExecInfo> {

	private _type: string;
	private _msngr: MessengerFunction;
	private _abort: boolean;
	private _curWork: Work<ExecInfo> | null;
	private _dependencies: Dictionary | null;
	private _hasListeners: boolean;

	constructor(type: string, messenger: MessengerFunction) {
		this._type = type;
		this._msngr = messenger;
		this._abort = false;
		this._curWork = null;
		this._dependencies = null;
		this._hasListeners = false;
	}

	public get dependencies(): Dictionary | null {
		return this._dependencies;
	}
	public set dependencies(value: Dictionary | null) {
		this._dependencies = value;
	}
	public get type(): string {
		return this._type;
	}
	public set type(value: string) {
		this._type = value;
	}
	public get curWork(): Work<ExecInfo> | null {
		return this._curWork;
	}
	public set curWork(value: Work<ExecInfo> | null) {
		this._curWork = value;
	}

	public onMessage(source: Object, purpose: string, what: string, content: any): any {
		if (purpose === "ask") {
			switch (what) {
				case "rootPathOf": return Folder.joinPaths(__root, content);
				
			}

			return this._msngr(source, purpose, what, content);
		}
	}

	public initialize() {
		this.attachListeners();
		if (!process.send) throw "Problem with WorkerEngine process! Make sure to spawn it as a child-process.";

		process.send({ name: "ready", type: this._type });
	}

	private attachListeners() {
		if (this._hasListeners) return;

		process.on("message", Functions.bound(this, "handleMessage"));
		process.on("disconnect", Functions.bound(this, "handleDisconnection"));
		process.on("exit", Functions.bound(this, "handleExit"));

		this._hasListeners = true;
	}

	public finishProcess() {
		if (!process.send) throw "Problem with WorkerEngine process! Make sure to spawn it as a child-process.";

		const work = this._curWork;
		if (!work) return;

		if (this._abort) work.crash();

		this.reset();
		return process.send({ name: "success", type: this._type, content: work });
	}

	public reset() {
		this._curWork = null;
	}

	// NOTE: Used in #attachListeners
	public handleMessage(workDependency: WorkDependency<ExecInfo>) {
		this.finishProcess();
	}

	// NOTE: Used in #attachListeners
	private handleDisconnection() {
		this._abort = true;
	}

	// NOTE: Used in #attachListeners
	private handleExit() {
		this._abort = true;
		this.finishProcess();
	}
}

export default WorkerEngine;
