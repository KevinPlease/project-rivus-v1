import { ChildProcess, fork } from "child_process";
import { Functions } from "../shared/Function";
import { AnyFunction } from "../types/AnyFunction";
import { Dictionary } from "../types/Dictionary";
import EventType from "./types/EventType";
import WorkerStatus from "./types/WorkerStatus";
import WorkDependency from "./types/WorkDependency";

class Worker<ExecInfo> {

	private _debugPort: number;
	private _cProcess: ChildProcess;
	private _id: string;
	private _hasMsgListener: boolean;
	private _status: WorkerStatus;
	private _data: WorkDependency<ExecInfo> | null;
	private _workCounter: number;

	constructor(filePath: string, debugPort?: number) {
		this._debugPort = debugPort || 0;
		// TODO: Move calculations to a factory.
		let options = this._debugPort > 0 ? { execArgv: ["--inspect-brk=" + this._debugPort] } : {};

		this._cProcess = fork(filePath, [], options);
		this._id = String(this._cProcess.pid);

		this._hasMsgListener = false;
		this._status = "idle";
		this._data = null;

		this._workCounter = 0;
	}

	public get status(): WorkerStatus { return this._status }
	public set status(value: WorkerStatus) { this._status = value	}
	public get id(): string { return this._id }
	public set id(value: string) { this._id = value	}
	public get data(): WorkDependency<ExecInfo> | null { return this._data }
	public set data(value: WorkDependency<ExecInfo> | null) { this._data = value	}

	public static forPath<ExecInfo>(filePath: string): Worker<ExecInfo> {
		return new Worker(filePath, 9229);
	}

	public static kill<ExecInfo>(worker: Worker<ExecInfo>) {
		return worker.kill();
	}

	public isLeftover(): boolean {
		return this.status === "idle" && !this._cProcess.connected;
	}

	public isIdle(): boolean {
		return this.status === "idle" && this._cProcess.connected;
	}

	public abort() {
		Functions.doTryCatch(this._cProcess, "disconnect");
	}

	public kill() {
		Functions.doTryCatch(this._cProcess, "kill");
	}

	public goBusyWithData(data: WorkDependency<ExecInfo> | null) {
		this._data = data;
		this._status = "busy";
	}

	public rest() {
		this._data = null;
		this._status = "idle";
	}

	public onEventReceived(eventType: EventType, eventCallback: AnyFunction) {
		const hasMsgListener = this._hasMsgListener;

		if (eventType === "message") {
			if (hasMsgListener) return;
	
			this._hasMsgListener = true;
		}
	
		this._cProcess.on(eventType, eventCallback);	
	}

	public sendMessage(message: Dictionary) {
		this._cProcess.send(message);
	}

	public startWithMessage(message: Dictionary) {
		this._workCounter += 1;
		this.sendMessage(message);
	}

	public start() {
		if (!this._data) throw "No message given to Worker!";

		this.startWithMessage(this._data);
	}



}

export default Worker;
