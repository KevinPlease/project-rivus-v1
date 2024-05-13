import { ModelCore } from "../../core/Model";
import { WorkData } from "../Work";
import { Dictionary } from "../../types/Dictionary";

type WorkDependency<ExecInfo> = {
	core: ModelCore<WorkData<ExecInfo>> | null;
	dependencies: Dictionary;
}

export default WorkDependency;
