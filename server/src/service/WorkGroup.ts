import ExArray from "../shared/Array";
import ExNumber from "../shared/Number";
import { Dictionary } from "../types/Dictionary";
import WorkerStatus from "./types/WorkerStatus";
import Worker from "./Worker";

class Wallet {

	private static TIME_MAINTENANCE = 30000;	// 30 secs in ms
	private static MAX_WALLET = 30 * 60000;	// 30 mins in ms
	private static WORKER_COMP_RATE = 2;

	private _amount: number;

	constructor() {
		this._amount = 0;
	}

	public static gain(busyCount: number) {
		return busyCount * Wallet.WORKER_COMP_RATE * Wallet.TIME_MAINTENANCE;
	}

	public static loss(workerCount: number) {
		return workerCount * Wallet.TIME_MAINTENANCE;
	}

	private static workerCompensation() {
		return Wallet.WORKER_COMP_RATE * Wallet.TIME_MAINTENANCE;
	}

	public safeSetWallet(amount: number) {
		this._amount =  ExNumber.bound(-Wallet.MAX_WALLET, amount, Wallet.MAX_WALLET);
	}

	public addWorkerCompensation() {
		const compensation = Wallet.workerCompensation();
		const amount = this._amount + compensation;
		this.safeSetWallet(amount);
	}

	public updateBalance(gain: number, loss: number) {
		const newWalletAmount = this._amount + gain - loss;
		this.safeSetWallet(newWalletAmount);
	}

	public empty() {
		this._amount = 0;
	}

	public isEmpty(): boolean {
		return this._amount === 0;
	}

	public isExhausted(): boolean {
		return this._amount < 0;
	}

}



class WorkGroup<ExecInfo> {

	private _type: string;
	private _wallet: Wallet;
	private _busyCount: number;
	private _workers: Worker<ExecInfo>[];
	private _dependencies: Dictionary | null;
	private _lastUpdated: number;
	
	constructor(type: string) {
		this._type = type;
		this._wallet = new Wallet();
		this._busyCount = 0;
		this._workers = [];

		this._dependencies = null;
		this._lastUpdated = -1;
	}

	public get type(): string {
		return this._type;
	}
	public set type(value: string) {
		this._type = value;
	}
	public get dependencies(): Dictionary | null {
		return this._dependencies;
	}
	public get lastUpdated(): number {
		return this._lastUpdated;
	}
	public set lastUpdated(value: number) {
		this._lastUpdated = value;
	}

	public setDependencies(value: Dictionary | null) {
		if (!value) return;
		
		this._dependencies = value;
		this._lastUpdated = Date.now();
	}

	public add(worker: Worker<ExecInfo>) {
		this._workers.push(worker);
	}

	public findByStatus(status: WorkerStatus) {
		return this._workers.find(worker => worker.status === status);
	}

	public forEachWorker(callback: (worker: Worker<ExecInfo>) => void) {
		return this._workers.forEach(callback);
	}

	public findIdleWorker() {
		return this._workers.find(worker => worker.isIdle());
	}

	public remove(worker: Worker<ExecInfo>) {
		worker.kill();
		ExArray.removeById(this._workers, worker.id);
		this._wallet.addWorkerCompensation();
	}

	public removeOneIdleWorker() {
		let worker = this.findIdleWorker();
		// TODO: fix scenario with the initial balance going into negative when spawning the first worker.
		// Happens since the worker takes some time until the beginning of work. 
		if (!worker) return;
	
		this.remove(worker);
	}

	public removeOneLeftoverWorker() {
		let worker = this._workers.find(worker => worker.isLeftover()); 
		if (!worker) return;
	
		this.remove(worker);
	}

	public getCount() {
		return this._workers.length;
	}

	public engageWorker(worker: Worker<ExecInfo>) {
		worker.start();
		this._busyCount += 1;
		return worker;
	}

	public restWithWorker(worker: Worker<ExecInfo>) {
		worker.rest();
		this._busyCount -= 1;
	}

	public doMaintenance() {
		const workerCount = this.getCount();
		const gainAmount = Wallet.gain(this._busyCount);
		const lossAmount = Wallet.loss(workerCount);
		
		const wallet = this._wallet;
		wallet.updateBalance(gainAmount, lossAmount);
	
		this.removeOneLeftoverWorker();

		if (wallet.isExhausted()) this.removeOneIdleWorker();
	}

	public reset(){
		this._workers.forEach(Worker.kill);
		this._workers = [];
	
		this._wallet.empty();
		this._busyCount = 0;
		this._dependencies = null;
	}

}

export default WorkGroup;
