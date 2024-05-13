import { AnyFunction } from "../types/AnyFunction";
import { OperationStatus } from "../types/Operation";

interface Object {
	_boundMethods: {[key: string]: AnyFunction}
}

const bound = (obj: any, funcName: string | AnyFunction, ...args: any[]): AnyFunction => {
	funcName = typeof funcName === "function" ? funcName.name : funcName;

	var _boundMethods = obj._boundMethods;
	if (!_boundMethods) return obj[funcName].bind(obj, ...args); // TODO Add boundMethods to relevant components

	var bound = _boundMethods[funcName];
	if (!bound) {
		bound = obj[funcName].bind(obj, ...args);
		_boundMethods[funcName] = bound;
	}

	return bound;
}

const doAsync = async (inst: any, funcName: string | AnyFunction, ...args: any[]): Promise<any | null> => {
	funcName = typeof funcName === "function" ? funcName.name : funcName;
	let result: any;

	try {
		result = await inst[funcName].call(inst, ...args);

	} catch (error) {
		console.error(error.message || error);
		result = null;
	}

	return result;
}

const doQuietAsync = async (inst: any, funcName: string, ...args: any[]): Promise<any | null> => {
	let result: any;

	try {
		result = await inst[funcName].call(inst, ...args);

	} catch (error) {
		result = null;
	}

	return result;
}


const doSimpleAsync = async (inst: any, funcName: string, ...args: any[]): Promise<OperationStatus> => {
	let result = await Functions.doAsync(inst, funcName, ...args);
	return result ? "success" : "failure";
}


const doTryCatch = (inst: any, funcName: string | AnyFunction, ...args: any[]): any => {
	funcName = typeof funcName === "function" ? funcName.name : funcName;
	
	let result: any;
	try {
		result = inst[funcName].call(inst, ...args);

	} catch (error) {
		console.error(error);
		result = null;
	}

	return result;	
}

const Functions = { bound, doAsync, doQuietAsync, doSimpleAsync, doTryCatch };

export { Functions };
export type { OperationStatus };

