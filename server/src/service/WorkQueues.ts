import Work from "./Work";
import { GenericDictionary } from "../types/Dictionary";
import WorkQueue from "./WorkQueue";

class WorkQueues<ExecInfo> {
	
	private _priorities: GenericDictionary<number>;
	private _workQueuesAsc: WorkQueue<ExecInfo>[];
	private _workQueuesDsc: WorkQueue<ExecInfo>[];

	constructor(priorities: GenericDictionary<number>) {
		this._priorities = priorities;
		this._workQueuesAsc = [
			new WorkQueue("standby", priorities.bottom),
			new WorkQueue("low", priorities.low),

			// don't assign to worker if no standby job is currently served
			new WorkQueue("normal", priorities.normal),
			new WorkQueue("high", priorities.high)
		];
		this._workQueuesDsc = this._workQueuesAsc.slice().reverse();
	}

	public addWork(work: Work<ExecInfo>) {
		const priority = work.data.priority;
		const workQueuesAsc = this._workQueuesAsc;

		if (priority === this._priorities.top) {
			workQueuesAsc[3].addTopWork(work);
		} else {
			workQueuesAsc[priority + 2].addWork(work);
		}
	}

	public removeWork(work: Work<ExecInfo>) {
		const queue = this.getWorkQueueByPriority(work.data.priority);
		if (!queue) return;

		queue.removeWork(work);
	}

	public removeWorkById(id: string) {
		const work = this.getWorkById(id);
		if (!work) return;

		this.removeWork(work);
	}
	
	public findLowestPriorityFreeWork(): Work<ExecInfo> | null {
		let work: Work<ExecInfo> | null = null;
		
		for (let index = 0; index < this._workQueuesAsc.length; index += 1) {
			const queue = this._workQueuesAsc[index];
			work = queue.findFreeWork();
			if (!work) continue;
			
			break;
		}

		return work;
	}

	public findLowestPriorityBusyWork(): Work<ExecInfo> | null {
		let work: Work<ExecInfo> | null = null;
		
		for (let index = 0; index < this._workQueuesAsc.length; index += 1) {
			const queue = this._workQueuesAsc[index];
			work = queue.findBusyWork();
			if (!work) continue;
			
			break;
		}

		return work;
	}

	public findNextWork(): Work<ExecInfo> | null {
		return this.getOldestFreeWork();
	}

	public getOldestFreeWork(): Work<ExecInfo> | null {
		let work: Work<ExecInfo> | null = null;
		
		for (let index = 0; index < this._workQueuesDsc.length; index += 1) {
			const queue = this._workQueuesDsc[index];
			work = queue.getOldestFreeWork();
			if (!work) continue;
			
			break;
		}

		return work;
	}

	public getWorkById(id: string): Work<ExecInfo> | null {
		let work: Work<ExecInfo> | null = null;
		
		for (let index = 0; index < this._workQueuesAsc.length; index += 1) {
			const queue = this._workQueuesAsc[index];
			work = queue.getWorkById(id);
			if (!work) continue;
			
			break;
		}

		return work;
	}

	public getWorkByWorkerId(id: number): Work<ExecInfo> | null {
		let work: Work<ExecInfo> | null = null;
		
		for (let index = 0; index < this._workQueuesAsc.length; index += 1) {
			const queue = this._workQueuesAsc[index];
			work = queue.getWorkByWorkerId(id);
			if (!work) continue;
			
			break;
		}

		return work;
	}

	public updateWork(work: Work<ExecInfo>) {
		const queuedWork = this.getWorkById(work.id);
		// CHECK: Should be redundant and never happen.
		if (!queuedWork) return;

		const queue = this.getWorkQueueByPriority(queuedWork.data.priority);
		if (!queue) return;

		queue.updateWork(work);
	}

	public getWorkQueueByName(name: string): WorkQueue<ExecInfo> | null {
		return this._workQueuesAsc.find(queue => queue.queueName === name) || null;
	}

	public getWorkQueueByPriority(priorityNumber: number): WorkQueue<ExecInfo> | null {
		const priorities = this._priorities;
		if (priorityNumber === priorities.top) priorityNumber = priorities.high;

		return this._workQueuesAsc.find(queue => queue.priority === priorityNumber) || null;
	}

	public forEach(onEachQueue: (queue: WorkQueue<ExecInfo>) => void) {
		this._workQueuesAsc.forEach(onEachQueue);
	}

	public areEmpty() {
		return this._workQueuesAsc.every(queue => queue.isEmpty());
	}

	public getWorkCount() {
		function countWork(prevCount: number, nextQueue: WorkQueue<ExecInfo>) { return prevCount + nextQueue.getCount() }
		return this._workQueuesAsc.reduce(countWork, 0);
	}

	public reset() {
		this._workQueuesAsc.forEach(queue => queue.clear());
	}

}

export default WorkQueues;
