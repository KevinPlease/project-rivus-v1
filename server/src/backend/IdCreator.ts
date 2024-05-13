import { ExString } from "../shared/String";

function createRepoId(child: string, parent: string) {
	return child + "@" + ExString.uncapitalize(parent);
}

function createBranchedRepoId(name: string, branch: string, domain: string) {
	const lowcaseBranch = ExString.uncapitalize(branch);
	const lowcaseDomain = ExString.uncapitalize(domain);
	return name + "/" + lowcaseBranch + "@" + lowcaseDomain;
}

function shortID(longId: string){
	return ExString.getLastChars(longId, 4).toUpperCase();
}

const IdCreator = { createRepoId, createBranchedRepoId, shortID };
export default IdCreator;