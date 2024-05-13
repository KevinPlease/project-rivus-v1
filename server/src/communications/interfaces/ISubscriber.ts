import { DispatchFunc } from "../types/DispatchFunc";

interface ISubInfo {
	subscriber: ISubscriber,
	eventHandler: DispatchFunc
}

interface ISubscriber {
	isOnce: boolean;

	subscribe(event: string, eventHandler: DispatchFunc): void;
	subscribeOnce(event: string, eventHandler: DispatchFunc): void;
	unsubscribe(event: string): void;
}

export type { ISubInfo, ISubscriber }
