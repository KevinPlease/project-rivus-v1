import WorkStatus from "../service/types/WorkStatus";
import Work from "../service/Work";

class WorkQueue<ExecInfo> {

	private _name: string;
	private _priority: number;
	private _workList: Work<ExecInfo>[];

	constructor(name: string, priority: number) {
		this._name = name;
		this._priority = priority;
		this._workList = [];
	}

	public get queueName(): string {
		return this._name;
	}
	public set queueName(value: string) {
		this._name = value;
	}
	public get priority(): number {
		return this._priority;
	}
	public set priority(value: number) {
		this._priority = value;
	}

	public getCount() { return this._workList.length }

	public isEmpty() { return this._workList.length === 0 }
	public hasBusyWork() { return this.findBusyWork() !== undefined }

	public addWork(work: Work<ExecInfo>) {
		work.queue();
		this._workList.push(work);
	}

	public addTopWork(work: Work<ExecInfo>) {
		work.queue();
		this._workList.unshift(work);
	}

	public updateWork(work: Work<ExecInfo>) {
		const workArr = this._workList;
		const workIndex = workArr.findIndex(workInArr => workInArr.id === work.id);
		work.worker = workArr[workIndex].worker;
		workArr[workIndex] = work;
	}
	
	public findIndexOf(work: Work<ExecInfo>): number {
		return this._workList.findIndex(workInArr => workInArr.id === work.id);
	}

	public removeWork(work: Work<ExecInfo>) {
		this._workList.splice(this.findIndexOf(work), 1);
	}

	public getWorkByWorkerId(workerId: number): Work<ExecInfo> | null {
		function sameWorker(work: Work<ExecInfo>): boolean {
			const worker = work.worker;
			if (!worker) return false;

			return String(workerId) === worker.id;
		}

		const work = this._workList.find(sameWorker);
		if (work && work.data.status !== "queued") return work;

		return null;
	}
	
	public getWorkById(id: string): Work<ExecInfo> | null {
		return this._workList.find(work => work.id === id) || null;
	}
	
	public getWorkListByStatus(jobStatus: WorkStatus): Work<ExecInfo>[] {
		function sameStatus(work: Work<ExecInfo>) { return work.data.status === jobStatus }
		return this._workList.filter(sameStatus);
	}
	
	public findWorkByPriority(priority: number): Work<ExecInfo> | null {
		function samePriority(work: Work<ExecInfo>) { return work.data.priority === priority }
		return this._workList.find(samePriority) || null;
	}
	
	public findBusyWork(): Work<ExecInfo> | null {
		return this._workList.find(work => work.worker !== null) || null;
	}

	public findFreeWork(): Work<ExecInfo> | null {
		return this._workList.find(work => work.worker === null) || null;
	}

	public getOldestFreeWork(): Work<ExecInfo> | null {
		const workList = this._workList;

		for (let index = workList.length - 1; index >= 0; index -= 1) {
			const workInArr = workList[index];
			if (!workInArr.worker) return workInArr;
		}

		return null;
	}

	public clear() { this._workList = [] }
}

export default WorkQueue;
