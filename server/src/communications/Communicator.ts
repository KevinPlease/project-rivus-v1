import { CommsManager } from "./CommsManager";
import IDispatcher from "./interfaces/IDispatcher";
import { ISubscriber } from "./interfaces/ISubscriber";
import { DispatchFunc } from "./types/DispatchFunc";

const eventBus = CommsManager.getInstance();


class Subscriber implements ISubscriber {
	private _func: DispatchFunc;
	public isOnce: boolean;

	constructor() {
		this._func = (arg: any) => {};
		this.isOnce = false;
	}
	
	public subscribeOnce(event: string, eventHandler: DispatchFunc): void {
		this.isOnce = true;
		this.subscribe(event, eventHandler);
	}

	public subscribe(event: string, func: DispatchFunc): void {
		this._func = func;
		eventBus.addSubscriber(this, event, func);
	}

	public unsubscribe(event: string): void {
		eventBus.removeSubscriber(this, event);
	}
}


class Communicator extends Subscriber implements IDispatcher {
	
	public dispatch<T>(event: string, arg?: T | undefined): Promise<any> {
		return eventBus.dispatchCall(this, event, arg);
	}

}


export { Communicator };
