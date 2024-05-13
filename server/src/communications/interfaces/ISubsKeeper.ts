import { ISubInfo } from "./ISubscriber";

interface ISubsKeeper {
	[event: string]: ISubInfo[];
}

export default ISubsKeeper;
