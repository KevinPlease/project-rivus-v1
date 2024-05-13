import { Dictionary } from "../../types/Dictionary";
import { FilterType } from "./FilterType";
import { Rule } from "./Rule";

type FilterData = Record<string, Rule>;

type Filter = Dictionary | {
	type: FilterType;
	data: FilterData;
};

export type { Filter };
