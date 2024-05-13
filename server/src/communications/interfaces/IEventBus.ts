import { DispatchFunc } from "../types/DispatchFunc";
import IDispatcher from "./IDispatcher";
import { ISubscriber } from "./ISubscriber";

interface IEventBus {
	dispatchCall<T>(dispatcher: IDispatcher, event: string, arg?: T): Promise<void>;
	addSubscriber(subscriber: ISubscriber, event: string, eventHandler: DispatchFunc): void;
	removeSubscriber(subscriber: ISubscriber, event: string): void;
}

export default IEventBus;
