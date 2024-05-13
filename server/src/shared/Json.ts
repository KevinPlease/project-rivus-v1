const functions = {

	isValid: (target: string): boolean => {
		let value = typeof target !== "string" ? JSON.stringify(target) : target;
		
		try {
			value = JSON.parse(value);
		} catch (e) {
			return false;
		}

		return typeof value === "object" && value !== null;
	}

	,

	safeParse: (text: string): {} | string => {
		if (!functions.isValid(text)) return text;

		let obj = {};

		try {
			obj = JSON.parse(text);
		} catch (error) {
			console.error(error.message);
		}

		return obj;
	}

	,

	formatted: (value: any): {} => {
		let formattedValue = value;
		if (isNaN(value)) {
			if (typeof value === "string") value = value.replace(/'/g, "\"");

			if (functions.isValid(value)) formattedValue = JSON.parse(value);
		} else {
			formattedValue = Number(value);
		}

		return formattedValue;
	}
}

export default functions;
