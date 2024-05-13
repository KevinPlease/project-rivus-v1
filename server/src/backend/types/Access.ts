import { GenericDictionary } from "../../types/Dictionary";

enum AccessType {
	MISS = 0,
	REDACTED = 1,
	
	SELFISH = 4,
	OVERSEER = 240
}

type AccessLevel = {
	read: AccessType;
	write: AccessType;
}

type FieldAccess = GenericDictionary<AccessLevel>;

type AccessInfo = GenericDictionary<FieldAccess>;

type Access = {
	global: FieldAccess;
	fieldAccess: AccessInfo;
};

type RepoAccess = GenericDictionary<Access>;

export { AccessType };
export type { Access, FieldAccess, AccessLevel, AccessInfo, RepoAccess };
