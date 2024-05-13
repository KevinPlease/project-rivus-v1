import { Dictionary, GenericDictionary } from "../../types/Dictionary";

type DetailedFind<Model> = {
	model: Model;
	formDetails: Dictionary;
	matchCount?: number;
}

type DetailedGetMany<Model> = {
	count: number;
	models: Model[];
	formDetails: GenericDictionary<Dictionary[]>;
}

export type { DetailedFind, DetailedGetMany };
