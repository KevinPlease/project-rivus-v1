import { Model, ModelCore } from "../core/Model";
import { MessengerFunction } from "../Messenger";
import { Dictionary } from "../types/Dictionary";
import ExObject from "../shared/Object";
import Worker from "./Worker";
import IdCreator from "../backend/IdCreator";
import WorkStatus from "./types/WorkStatus";
import Metadata from "../core/types/Metadata";
import OwnershipInfo from "../backend/types/OwnershipInfo";


class WorkSchedule {

	private _startTime: number;
	private _submissionTime: number;
	private _completionTime: number;
	private _expirationTime: number;

	constructor(startTime: number, submissionTime: number, completionTime: number, expirationTime: number) {
		this._startTime = startTime;
		this._submissionTime = submissionTime;
		this._completionTime = completionTime;
		this._expirationTime = expirationTime;
	}

	public get startTime(): number {
		return this._startTime;
	}
	public set startTime(value: number) {
		this._startTime = value;
	}
	public get submissionTime(): number {
		return this._submissionTime;
	}
	public set submissionTime(value: number) {
		this._submissionTime = value;
	}
	public get completionTime(): number {
		return this._completionTime;
	}
	public set completionTime(value: number) {
		this._completionTime = value;
	}
	public get expirationTime(): number {
		return this._expirationTime;
	}
	public set expirationTime(value: number) {
		this._expirationTime = value;
	}

	static empty(): WorkSchedule {
		const defaultExpirationTime = 24 * 60 * 60 * 1000; // 24 h
		var date = new Date();
		return new WorkSchedule(0, date.getTime(), 0, date.setTime(date.getTime() + defaultExpirationTime));
	}

	static fromInfo(info: Dictionary): WorkSchedule {
		return new WorkSchedule(info._startTime, info._submissionDate, info._completionDate, info._expirationTime);
	}

	start() {
		this._startTime = Date.now();
	}

	finish() {
		this._completionTime = Date.now();
	}

	hasTimerExpired() {
		const currentDateTime = new Date();
		const expirationDateTime = new Date(this._expirationTime);
		return currentDateTime.getTime() > expirationDateTime.getTime();
	}
}

type WorkData<ExecInfo> = {
	schedule: WorkSchedule;
	groupId: string;
	execInfo: ExecInfo;
	result: Dictionary;
	status: WorkStatus;
	priority: number;
}

// TODO: Move to WorkRepo once available
const REPO_NAME = "work";

class Work<ExecInfo> extends Model<WorkData<ExecInfo>> {

	static ROLE = "work";
	private _worker: Worker<ExecInfo> | null;

	constructor(core: ModelCore<WorkData<ExecInfo>>) {
		super(core);
		this._worker = null;
		const scheduleData = core.data.schedule;
		this.data.schedule = WorkSchedule.fromInfo(scheduleData);
	}

	public get worker(): Worker<ExecInfo> | null {
		return this._worker;
	}
	public set worker(value: Worker<ExecInfo> | null) {
		this._worker = value;
	}

	static emptyData(): WorkData<Dictionary> {
		return {
			schedule: WorkSchedule.empty(),
			groupId: "default",
			execInfo: {},
			result: {},
			status: "pending",
			priority: 0
		};
	}
	public static create(say: MessengerFunction, data: WorkData<Dictionary>, ownership: OwnershipInfo, meta?: Metadata): Work<Dictionary> {
		if (ExObject.isDictEmpty(data)) data = Work.emptyData();

		if (!ownership.branch) throw "WORK: Missing branch from ownership info!";

		const model =  Model._create(say, data, REPO_NAME, this.ROLE, ownership, meta);
		return new Work(model.toJSON());
	}

	static fromInfo(say: MessengerFunction, info: Dictionary, ownership: OwnershipInfo, meta: Metadata): Work<Dictionary> {
		const schedule = WorkSchedule.empty();
		const workData: WorkData<Dictionary> = { groupId: "default", execInfo: info, priority: 0, result: {}, schedule, status: "pending" };
		return Work.create(say, workData, ownership, meta);
	}

	static request<ExecInfo>(execInfo: ExecInfo, say: MessengerFunction): Promise<Work<ExecInfo>> {
		return say(this, "ask", "work", execInfo) as Promise<Work<ExecInfo>>;
	}

	public start() {
		const worker = this._worker;
		if (!worker) return console.error("Work does not have a worker assgned!");

		const data = this.data;
		data.status = "executing";
		data.schedule.start();
	}

	public queue() {
		this.data.status = "queued";
	}

	public finish(status: WorkStatus, result: Dictionary) {
		this.data.status = status;
		this.data.schedule.finish();
		this.data.result = result;
	}

	public stop() {
		this._worker?.abort();
		this._worker = null;
		this.data.status = "queued";
	}

	public crash() {
		this._worker = null;
		this.finish("failed", { error: "Execution failed! Most likely our fault." });
	}

}

export default Work;
export { WorkSchedule };
export type { WorkData };
