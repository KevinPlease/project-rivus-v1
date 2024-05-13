import OS from "os";

import { Communicator } from "../communications/Communicator";
import { ModelCore } from "../core/Model";
import { MessengerFunction } from "../Messenger";
import { Functions } from "../shared/Function";
import { Dictionary, GenericDictionary } from "../types/Dictionary";
import Work, { WorkData } from "./Work";
import Worker from "./Worker";
import WorkGroup from "./WorkGroup";
import WorkerMessage from "./types/WorkerMessage";
import ImageEnhancement from "../enhancers/ImageEnhancement";

const CPU_THREADS = OS.cpus().length;

class WorkerKeeper extends Communicator {

	private static MAINTENANCE_INTERVAL = 1000;		// in ms
	private static MAX_WORKERS = CPU_THREADS;
	private static SERVICE_PATHS_FOR_TYPE = {
		VENATORE: "server/bin/venatores/Venatore.js",
		[ImageEnhancement.ROLE]: "server/bin/enhancers/ImageEnhancerEngine.js",
	};

	private _debugPort: number;
	private _workerCount: number;
	private _workGroups: GenericDictionary<WorkGroup<any>>;
	private _maintenanceInterval: any;
	private _msngr: MessengerFunction;

	constructor(debugPort: number, msngr: MessengerFunction) {
		super();

		this._debugPort = debugPort;
		this._workerCount = 0;
		this._workGroups = {};
		this._maintenanceInterval = null;
		this._msngr = msngr;
	}

	private say(purpose: string, what: string, content: any): any {
		return this._msngr(this, purpose, what, content);
	}

	public static create(debugPort: number, msngr: MessengerFunction): WorkerKeeper {
		const workerKeeper = new WorkerKeeper(debugPort || -1, msngr);
		workerKeeper.startMaintenance();
		return workerKeeper;
	}
	
	public static requestWorker<ExecInfo>(work: Work<ExecInfo>, say: MessengerFunction): Worker<ExecInfo> {
		return say(this, "ask", "worker", work);
	}

	private doMaintenance() {
		const workGroupDict = this._workGroups;
		for (const type in workGroupDict) {
			const workGroup = workGroupDict[type];
			workGroup.doMaintenance();
			if ( workGroup.getCount() > 0 ) continue;
	
			delete workGroupDict[type];
		}
	}

	private startMaintenance() {
		const funcDoMaintenance = Functions.bound(this, this.doMaintenance);
		this._maintenanceInterval = setInterval(funcDoMaintenance, WorkerKeeper.MAINTENANCE_INTERVAL);
	}

	public hasMaxWorkers() {
		return this._workerCount >= WorkerKeeper.MAX_WORKERS;
	}

	private handleMsgFromWorker<ExecInfo>(worker: Worker<ExecInfo>, msg: WorkerMessage<ExecInfo>) {
		const workerDependencies = worker.data;
		const workerCore = workerDependencies?.core;
		if (!workerDependencies || !workerCore) return console.error("WorkerKeeper: Missing worker data in #handleMsgFromWorker");

		const msgName = msg.name;
		const workGroup = this.getWorkGroupForType(workerCore.data.groupId);
	
		if (msgName === "ready") {
			this.executeWork(workerCore, workGroup, worker);
	
		} else if (msgName === "success") {
			this._workerCount = this._workerCount - 1;
			workGroup.restWithWorker(worker);
			this.dispatch("work finished", msg);
	
		} else {
			// TODO: gracefully handle errors:
			// 1. Low-level errors (e.g. time-outs) Should be handled by the worker itself, either retried or turned into logical errors (see right below).
			// 2. Logical errors: Should be communicated as "failure" of the work itself, considering it as finished (releasing the worker etc.)
			// 3. Unexpected errors: Should be considered failures of the worker's code, resulting to its killing.
			this._workerCount = this._workerCount - 1;
			workGroup.restWithWorker(worker);
		}
	}

	private attachListenerToWorker<ExecInfo>(worker: Worker<ExecInfo>) {
		const funcHandleMsg = Functions.bound(this, this.handleMsgFromWorker, worker);
		worker.onEventReceived("message", funcHandleMsg);
	}
	

	private prepareWorkerInGroupWithData<ExecInfo>(worker: Worker<ExecInfo>, workGroup: WorkGroup<ExecInfo>, work: Work<ExecInfo> | null): Worker<ExecInfo> {
		const workCore = work?.toJSON() || null;
		worker.goBusyWithData({ core: workCore, dependencies: {} });
	
		this.attachListenerToWorker(worker);
		this._workerCount += 1;
	
		workGroup.add(worker);
		return worker;
	}
	
	private createAndGetWorkerInGroup<ExecInfo>(workGroup: WorkGroup<ExecInfo>, work: Work<ExecInfo>): Worker<ExecInfo> {
		const execFilePath = WorkerKeeper.SERVICE_PATHS_FOR_TYPE[workGroup.type] || WorkerKeeper.SERVICE_PATHS_FOR_TYPE.VENATORE;
		const worker = Worker.forPath<ExecInfo>(execFilePath);
		return this.prepareWorkerInGroupWithData(worker, workGroup, work);
	}

	private getWorkGroupForType<ExecInfo>(type: string): WorkGroup<ExecInfo> {
		const workGroups = this._workGroups;
		
		let workGroup = workGroups[type];
		if (!workGroup) {
			workGroup = new WorkGroup(type);
			workGroups[type] = workGroup;
		}
	
		return workGroup;
	}

	private prepareImmediateExecution<ExecInfo>(workGroup: WorkGroup<ExecInfo>, workCore: Work<ExecInfo>) {
		return; // WIP: find a worker by stopping another job if necessary;
	}
	
	private prepareNormalExecution<ExecInfo>(workGroup: WorkGroup<ExecInfo>, work: Work<ExecInfo>) {
		const worker = workGroup.findIdleWorker();
		if (worker) return this.executeWork(work.toJSON(), workGroup, worker);
		
		if (this.hasMaxWorkers()) return console.warn("Maximum number of service workers reached.");
		
		return this.createAndGetWorkerInGroup(workGroup, work);
	}
	
	private async executeWork<ExecInfo>(workCore: ModelCore<WorkData<ExecInfo>>, workGroup: WorkGroup<ExecInfo>, worker: Worker<ExecInfo>) {
		const dependencies: Dictionary = await this.say("ask", "workDependencies", { workCore, lastUpdated: workGroup.lastUpdated });
		workGroup.setDependencies(dependencies);
		
		worker.goBusyWithData({ core: workCore, dependencies: workGroup.dependencies || {} });
		workGroup.engageWorker(worker);
		this.dispatch("work started", { id: workCore?._id, type: workGroup.type });
	}
	
	private requestExecutionOfWork<ExecInfo>(work: Work<ExecInfo>) {
		const data = work.data;
		const priority = data.priority;
		const workGroup = this.getWorkGroupForType(data.groupId);
	
		// TODO: priority checks should use the same PRIORITIES from the execution/config.json
		if (priority === 2) {
			return this.createAndGetWorkerInGroup(workGroup, work);
	
		} else if (priority === 1) {
			return this.prepareImmediateExecution(workGroup, work);
	
		} else {
			return this.prepareNormalExecution(workGroup, work);
		}
	}
	
	public requestExecution<ExecInfo>(work: Work<ExecInfo>) {
		return this.requestExecutionOfWork(work);
	}

	public getAllWorkers() {
		const workerPreviews: Dictionary[] = [];

		const workGroups = this._workGroups;
		for (const type in workGroups) {
			const group = workGroups[type];
			group.forEachWorker(worker => workerPreviews.push({id: worker.id, status: worker.status}));
		}
		
		return workerPreviews;
	}
	
	public reset() {
		const workGroups = this._workGroups;
		for (const type in workGroups) {
			const group = workGroups[type];
			group.reset();
		}
	
		this._workGroups = {};
		this._workerCount = 0;
	}

}

export default WorkerKeeper;
