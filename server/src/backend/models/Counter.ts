import { Model } from "../../core/Model";
import { MessengerFunction } from "../../Messenger";
import Metadata from "../../core/types/Metadata";
import OwnershipInfo from "../types/OwnershipInfo";
import { BaseRepo } from "../repos/BaseRepo";
import { CounterRepo } from "../repos/CounterRepo";

type CounterData = {
	isDraft?: boolean;
	role: string;
	value: string;
	counter: number;
	prefix: string;
};

class Counter extends Model<CounterData> {

	public static ROLE = "counter";

	public static emptyData(): CounterData {
		return {
			role: "",
			value: "UX 100",
			counter: 100,
			prefix: "UX"
		};
	}

	public static create(say: MessengerFunction, data: CounterData, ownership: OwnershipInfo, meta?: Metadata): Counter {
		const repoName = CounterRepo.REPO_NAME;
		return Model._create(say, data, repoName, repoName, { domain: ownership.domain }, meta) as Counter;
	}

	public increment(): Counter {
		const data = this.data;
		data.counter = data.counter + 1;
		data.value = data.prefix + " " + data.counter;
		return this;
	}

}

export { Counter };
export type { CounterData };
