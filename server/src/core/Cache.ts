import { IdentifiableDictionary } from "../types/IdentifiableDictionary";

class Cache<T extends IdentifiableDictionary> {
	private _dict: Record<string, T>;

	constructor(dict: {} = {}) {
		this._dict = dict;
	}


	set(object: T, id?: string): Cache<T> {
		if (!id) id = object.id;
		this._dict[id] = object;
		return this;
	}


	removeById(id: string): Cache<T> {
		delete this._dict[id];
		return this;
	}


	remove(object: T): Cache<T> {
		return this.removeById(object.id);
	}


	updateEntry(object: T, oldId?: string): Cache<T> {
		if (oldId && oldId !== object.id) this.removeById(oldId);
		return this.set(object);
	}


	getBy(id: string): T {
		return this._dict[id];
	}


	includesId(id: string): boolean {
		return this._dict[id] !== undefined;
	}

	
	includesObject(obj: T): boolean {
		return this.includesId(obj.id);
	}


	setCache(newCacheObj: {}): Cache<T> {
		this._dict = newCacheObj;
		return this;
	}


	clear(): Cache<T> {
		this._dict = {};
		return this;
	}

	getAll(): T[] {
		return Object.values(this._dict);
	}

}

export default Cache;
