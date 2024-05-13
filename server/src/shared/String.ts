const ExString = {

	isString: (string: any): boolean => {
		return (typeof string === "string" || string instanceof String);
	}
	
	,
	
	firstCapitalLetter: (word: string): string => {
		let foundCapitalLetters = word.match(/[A-Z]/) || [];
		if (foundCapitalLetters?.length === 0) return "";
	
		return foundCapitalLetters[0] || "";
	}
	
	,

	capitalize: (str: string): string => {
		return str.charAt(0).toUpperCase() + str.slice(1);
	}

	,

	uncapitalize: (word: string): string => {
		return word.charAt(0).toLowerCase() + word.slice(1);
	}
	
	,

	caretReplace: (word: string, dataToReplace: string): string => {
		return word.replace(/\^\[([^[\]^]*)\]\^/g, (m: string, p: string) => {
			let v = dataToReplace[p];
			return v === undefined ? m : v;
		});
	}
	
	,

	removeTabs: (word: string): string => {
		return word.replace(/\t/g, "");
	}
	
	,

	removeSpaces: (word: string): string => {
		return word.replace(/\s/g, "");
	}
	
	,

	deprefix: (word: string, symbol: string): string => {
		return word.startsWith(symbol) ? word.slice(symbol.length) : word.valueOf();
	}
	
	,

	desuffix: (word: string, symbol: string): string => {
		return word.endsWith(symbol) ? word.slice(0, -symbol.length) : word.valueOf();
	}
	
	,

	equalsIdOf: (word: string, obj: {id: string}): boolean => obj.id === word.valueOf()
	,
	equalsNameOf: (word: string, obj: {name: string}): boolean => obj.name === word.valueOf()
	,
	equalsStatusOf: (word: string, obj: {status: string}): boolean => obj.status === word.valueOf()
	,
	equalsRoleOf: (word: string, obj: {role: string}): boolean => obj.role === word.valueOf()
	
	,

	getCamelCasePhrase: (word: string, sym: string): string => {
		return word.split(sym).map(ExString.capitalize).join("");
	}
	
	,

	getLastChar: (word: string): string => word[word.length - 1]
	
	,

	getLastChars: (word: string, count: number): string => {
		const startIndex = word.length - count;
		return word.slice(startIndex);
	}

	,

	getLastNonWord: (word: string):string => {
		let matches = word.match(/\W/g) || [];
		return matches[matches.length - 1];
	}
	
	,

	getLastWord: (word: string): string => {
		let lastNonWord = ExString.getLastNonWord(word);
		let lastIndexOfNonWord = word.lastIndexOf(lastNonWord);
		let startIndexOfLastWord = lastIndexOfNonWord + 1;
		return word.slice(startIndexOfLastWord);
	}
	
	,

	hasChar: (word: string, char: string): boolean => word.indexOf(char) > -1
	
	,

	hasOnlySpaces: (word: string): boolean => !(/\S/.test(word))
	
	,

	// TODO: Consider making this a method of RegExp.
	removeSingleChar: (word: string, char: string): string => {
		return word.replace(new RegExp(char), "");
	}
	
	,

	sliceByString: (word: string, str: string, since: boolean, last: boolean, inclusive: boolean): string => {
		let index = last ? word.lastIndexOf(str) : word.indexOf(str);
		if (index < 0) {
			return since === last ? word : "";
		}
	
		let from = 0;
		let to;
		if (since) {
			from	= index + (inclusive ? 0 : str.length);
		} else {
			to		= index + (inclusive ? str.length : 0);
		}
		return word.slice(from, to);
	}
	
	,

	since: (word: string, symbol: string): string => ExString.sliceByString(word, symbol, true, false, true)
	,
	sinceAfter: (word: string, symbol: string): string => ExString.sliceByString(word, symbol, true, false, false)
	,
	sinceAfterLast: (word: string, symbol: string): string => ExString.sliceByString(word, symbol, true, true, false)
	,
	sinceLast: (word: string, symbol: string): string => ExString.sliceByString(word, symbol, true, true, true)
	,
	upTo: (word: string, symbol: string): string => ExString.sliceByString(word, symbol, false, false, true)
	,
	upToBefore: (word: string, symbol: string): string => ExString.sliceByString(word, symbol, false, false, false)
	,
	upToBeforeLast: (word: string, symbol: string): string => ExString.sliceByString(word, symbol, false, true, false)
	,
	upToLast: (word: string, symbol: string): string => ExString.sliceByString(word, symbol, false, true, true)
	
	,

	betweenFirstTwo: (word: string, startSymbol: string, endSymbol?: string): string => {
		if (!endSymbol) endSymbol = startSymbol;
		word = ExString.sinceAfter(word, startSymbol);
		return ExString.upToBefore(word, endSymbol);
	}

	,

	betweenLastTwo: (word: string, startSymbol: string, endSymbol: string = startSymbol): string => {
		word = ExString.sinceAfterLast(word, startSymbol);
		return ExString.upToBeforeLast(word, endSymbol);
	}

	,

	zeroPrefixed: (n: number) => { return (n < 10 ? "0" : "") + n }

}


export { ExString };
