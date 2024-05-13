import { MessengerFunction } from "../Messenger";
import { GenericDictionary } from "../types/Dictionary";
import WorkQueues from "../service/WorkQueues";
import WorkerKeeper from "../service/WorkerKeeper";
import { ModelCore } from "../core/Model";
import { Domain } from "../backend/models/Domain";
import { Branch } from "../backend/models/Branch";
import RepoRequest from "../backend/types/RepoRequest";
import OwnRequestData from "../backend/types/OwnRequestData";
import ImageEnhancement, { ImgEnhancementData, ImgEnhancementExecInfo } from "./ImageEnhancement";

const INTERVAL_SCHEDULE_CHECK = 2000;	// in milliseconds


class ImgEnhancMaster {

	private _queues: WorkQueues<ImgEnhancementExecInfo>;
	private _scheduleCheckInterval: any;
	private _massHuntInterval: any;

	constructor(priorities: GenericDictionary<number>) {
		this._queues = new WorkQueues(priorities);
	}
	
	public getMessenger(enhancement: ImageEnhancement, say: MessengerFunction): MessengerFunction {
		return (source: Object, purpose: string, what: string, content?: any): any => {
			if (purpose === "ask" && what === "repo") {
				const domainName = enhancement.getDomainName();
				const domain = Domain.byName(domainName, say);

				const repoRequest: RepoRequest = { domain, repoName: content };
				return say(ImgEnhancMaster, "ask", "repoForInfo", repoRequest);
			}

			return say(source, purpose, what, content);
		};
	}

	public initScheduling(say: MessengerFunction) {
		const self = this;
		
		const scheduleNextWork = () => {
			const queues = self._queues;
			const nextEnhanc = queues.findNextWork();
			if (!nextEnhanc) return;
	
			const msngr = self.getMessenger(nextEnhanc, say);
			self.assignWorker(nextEnhanc, msngr);
		};
		this._scheduleCheckInterval = setInterval(scheduleNextWork, INTERVAL_SCHEDULE_CHECK);
	}

	private organizeWork(work: ImageEnhancement, say: MessengerFunction) {
		const skipExec = work.data.status === "executing";
		if (skipExec) return;
	
		this.queueWork(work, say);
	}
	
	
	private assignWorker(work: ImageEnhancement, say: MessengerFunction) {
		const worker = WorkerKeeper.requestWorker(work, say);
		if (worker) work.worker = worker;
	}
	
	
	private queueWork(work: ImageEnhancement, say: MessengerFunction) {
		this._queues.addWork(work);
		this.assignWorker(work, say);
	}

	public async createWork(data: OwnRequestData, say: MessengerFunction): Promise<ImageEnhancement | null> {
		const ownership = { domain: data.domain.data.name, branch: data.branch.data.name };
		const work = ImageEnhancement.fromInfo(say, data.data, ownership);
		const msngr = this.getMessenger(work, say);
		// const huntRepo = HuntRepo.getInstance(msngr);
		// const operationStatus = await huntRepo.safeAdd(work, say);
		// if (!operationStatus || operationStatus === "failure") return null;

		this.organizeWork(work, msngr);
		return work;
	}

	public startWork(id: string, say: MessengerFunction) {
		const work = this._queues.getWorkById(id);
		if (!work) return;
		
		const skipExecNow = work.data.status === "executing";
		if (skipExecNow) return;
	
		work.start();

		return work;
		// const msngr = this.getMessenger(work, say);
		// const huntRepo = HuntRepo.getInstance(msngr);
		// return huntRepo.edit(work.id, work, msngr);
	}

	public handleFinishedWork(core: ModelCore<ImgEnhancementData>, say: MessengerFunction) {
		const  updatedWork = new ImageEnhancement(core);
		
		const huntQueues = this._queues;
		huntQueues.removeWorkById(core._id || "");
	
		return updatedWork;
		// const msngr = this.getMessenger(updatedHunt, say);
		// // Update finished job
		// const huntRepo = HuntRepo.getInstance(msngr);
		// return huntRepo.edit(updatedHunt.id, updatedHunt, msngr);
	}

	public reset() {
		this._queues.reset();
	}

}

export default ImgEnhancMaster;
