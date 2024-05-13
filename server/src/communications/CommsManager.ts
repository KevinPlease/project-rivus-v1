import IDispatcher from "./interfaces/IDispatcher";
import IEventBus from "./interfaces/IEventBus";
import { ISubscriber } from "./interfaces/ISubscriber";
import ISubsKeeper from "./interfaces/ISubsKeeper";
import { DispatchFunc } from "./types/DispatchFunc";

class CommsManager implements IEventBus {
	private static instance?: CommsManager;
	private subsKeeper: ISubsKeeper;

	constructor() {
		this.subsKeeper = {};
	}

	public static getInstance(): CommsManager {
		if (!this.instance) this.instance = new CommsManager();

		return this.instance;
	}

	public async dispatchCall<T>(dispatcher: IDispatcher, event: string, arg?: T): Promise<void> {
		const subsInstances = this.subsKeeper[event];
		if (!subsInstances) return;

		for (let index = 0; index < subsInstances.length; index++) {
			const subInfo = subsInstances[index];
			await subInfo.eventHandler.call(subInfo.subscriber, dispatcher, arg);
			if (subInfo.subscriber.isOnce) {
				this.removeSubscriber(subInfo.subscriber, event);
				index--;
			}
		}
	}

	public removeSubscriber(subscriber: ISubscriber, event: string): void {
		const subsKeeper = this.subsKeeper;
		const eventSubscribers = subsKeeper[event];

		const index = eventSubscribers.findIndex(subInfo => subInfo.subscriber === subscriber);
		eventSubscribers.splice(index, 1);
		
		if (eventSubscribers.length === 0) delete subsKeeper[event];
	}

	public addSubscriber(subscriber: ISubscriber, event: string, eventHandler: DispatchFunc): void {
		const subsKeeper = this.subsKeeper;

		if (!subsKeeper[event]) subsKeeper[event] = [];

		subsKeeper[event].push({ subscriber, eventHandler });
	}

}

export { CommsManager };
