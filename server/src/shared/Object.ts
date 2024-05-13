import { Dictionary } from "../types/Dictionary";

const functions = {

	isDictEmpty: (object: {}): boolean => {
		for (let key in object) return false;
	
		return true;
	}
	
	,
	
	emptyDict: (object: {}): {} => {
		for (let key in object) {
			delete object[key];
		}
	
		return object;
	}
	
	,

	firstLevelOf: (obj: {}): {} => {
		let res = {};
		for (let key in obj) {
			let val = obj[key];
			if (val instanceof Object) val = "...";
	
			res[key] = val;
		}
	
		return res;
	}
	
	,

	fromShallowClone: (obj: {}): {} => {
		if (typeof obj !== 'object') return obj;
	
		if (obj instanceof Object) return functions.clone(obj);
	
		return obj;
	}
	
	,

	fromDeepClone: (obj: {}): {} => {
		if (typeof obj !== 'object' || obj === null) return obj;
	
		if (obj instanceof Object) return functions.clone(obj);
	
		return obj;
	}
	
	,

	clone: (dict: {}): {} => {
		let cloneDict = {};
	
		for (let key in dict) {
			cloneDict[key] = dict[key];
		}
	
		return cloneDict;
	}
	
	,

	cloneDeeply: (dict: {}): Dictionary => {
		let cloneDict = {};
	
		for (let key in dict) {
			cloneDict[key] = functions.fromDeepClone(dict[key]);
		}
	
		return cloneDict;
	}

}

export default functions;
