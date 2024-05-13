const ExNumber = {

	bound: (min: number, number: number, max: number): number => {
		return Math.min(Math.max(number, min), max);
	}
	
	,

	isWithinRange: (min: number, number: number, max: number): boolean => {
		return number >= min && number <= max;
	}
	,

	sortByMaxNumber: (a: number | string, b: number | string): number => {
		return Number(b) - Number(a);
	}
};

export default ExNumber;
