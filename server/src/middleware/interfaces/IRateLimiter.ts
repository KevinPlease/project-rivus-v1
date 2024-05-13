import { Dictionary } from "../../types/Dictionary";
import { Conformity } from "../types/Conformity";
import { RequestConformityInfo } from "../types/RequestConformityInfo";

interface IRateLimiter {

	conform(info: RequestConformityInfo): Conformity

}

export default IRateLimiter;
