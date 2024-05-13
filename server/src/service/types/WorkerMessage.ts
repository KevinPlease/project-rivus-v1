import { ModelCore } from "../../core/Model";
import { WorkData } from "../Work";

type WorkerMessage<ExecInfo> = {
	type: string;
	name: string;
	content: ModelCore<WorkData<ExecInfo>>;
}

export default WorkerMessage;
