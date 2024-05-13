import PATH_FOR_WORKTYPE from "./WorkTypes";

const BASE_URL = "http://rivus.localhost:5000/";

function workerCros(url) {
	const iss = "importScripts('" + url + "');";
	return URL.createObjectURL(new Blob([iss]));
}

class WorkerKeeper {

	static MAX_WORKERS = 1;
	static instance = null;

	constructor() {
		this.workers = [];
		this.context = null;
	}

	static getInstance() {
		if (!this.instance) this.instance = new WorkerKeeper();

		return this.instance;
	}

	createWorker(workType) {
		if (!this.context.Worker) throw "WorkerKeeper: Browser does not support Web Workers 😔";

		const workUrl = PATH_FOR_WORKTYPE[workType];
		if (!workUrl) throw "WorkerKeeper: Bad workType given!";

		if (this.workers.length === WorkerKeeper.MAX_WORKERS) return console.info("WorkerKeeper: Max number of workers spawned...");

		const url = workerCros(new this.context.URL(workUrl, BASE_URL).href);
		// const worker = new this.context.Worker(new this.context.URL(workUrl, import.meta.url));
		const worker = new this.context.Worker(url);
		worker.id = this.workers.length + 1;
		this.workers.push(worker);
		return worker;
	}

	killWorker(id) {
		const workers = this.workers;
		const worker = workers.find(worker => worker.id === id);
		this.workers.splice(workers.indexOf(worker), 1);
		worker.terminate();
	}

}

export default WorkerKeeper;
