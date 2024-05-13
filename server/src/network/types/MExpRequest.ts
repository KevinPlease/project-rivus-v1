import { Request as ExpRequest } from "express";
import { FileInfo } from "../../files/types/FileInfo";
import { IdentifiableDictionary } from "../../types/IdentifiableDictionary";

interface MExpRequest extends ExpRequest {
	user?: IdentifiableDictionary,
	uploadedFiles?: FileInfo[]
}

export type { MExpRequest };
