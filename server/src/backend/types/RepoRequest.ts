import { Domain } from "../models/Domain";

type RepoRequest = {
	domain: Domain;
	repoName: string;
}

export default RepoRequest;
