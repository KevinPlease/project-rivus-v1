import { Branch } from "../models/Branch";
import { Domain } from "../models/Domain";

type OwnRequestData = {
	domain: Domain;
	branch: Branch;
	data: any;
}

export default OwnRequestData;
