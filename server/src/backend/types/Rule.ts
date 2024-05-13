import { FilterComparator } from "./FilterComparator";

type RuleType = "basic" | "range";

type Rule = {
	comparator: FilterComparator,
	type: RuleType,
	values: string[] | number[]
}

export type { Rule };
