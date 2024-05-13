import SysPath from "path";
import FS from "fs/promises";

import { Functions, OperationStatus } from "../shared/Function";
import { ExString } from "../shared/String";
import File from "./File";
import { MessengerFunction } from "../Messenger";
import Path from "./Path";

class Folder {
	
	public static SYS_FOLDER = "sys";
	public static FS_SEPARATOR = process.platform === "win32" ? "\\" : "/";

	private _path: string;
	private _name: string;

	constructor(ownPath: string, name: string) {
		this._path = ownPath;
		this._name = name;
	}

	public get path(): string { return this._path }

	static nameFromPath(path: string): string {
		return ExString.betweenLastTwo(path, Folder.FS_SEPARATOR);
	}

	static createPath(say: MessengerFunction, ...args: any[]) : string {
		const path = args.join(Folder.FS_SEPARATOR);
		return SysPath.isAbsolute(path) ? path : Path.rootOf(path, say);
	}

	static fromPath(ownPath: string, say: MessengerFunction): Folder {
		let path = SysPath.isAbsolute(ownPath) ? ownPath : Path.rootOf(ownPath, say);
		let name = Folder.nameFromPath(ownPath);
		return new Folder(path, name);
	}
	
	static inProjectFromPath(ownPath: string, say: MessengerFunction): Folder {
		const path = Path.rootOf(ownPath, say);
		const name = Folder.nameFromPath(path);
		return new Folder(path, name);
	}

	static joinPaths(path1: string, path2: string): string {
		let isPath1Absolute = path1 && SysPath.isAbsolute(path1);
		if (!isPath1Absolute) throw "Invalid first path given.";

		return SysPath.join(path1, path2);
	}


	getAbsolutePath(relativePath: string): string {
		let isAbsolute = SysPath.isAbsolute(relativePath);
		return isAbsolute ? relativePath : Folder.joinPaths(this.path, relativePath);
	}

	getChildFolder(pathOrName: string): Folder {
		let path = this.path;
		
		if (pathOrName) path = SysPath.join(path, pathOrName);
		
		let name = Folder.nameFromPath(path);
		return new Folder(path, name);
	}

	getFile(fileName: string): File {
		let filePath = SysPath.join(this.path, fileName);
		return File.fromInfo(filePath, fileName);
	}
	
	async exists(): Promise<boolean> {
		let result = await Functions.doAsync(FS, "access", this.path);
		return result === null ? false : true;
	}

	async isDirectory(): Promise<boolean> {
		let stats = await Functions.doAsync(FS, "stat", this.path);
		return stats ? stats.isDirectory() : false;
	}

	async isFile(): Promise<boolean> {
		let stats = await Functions.doAsync(FS, "stat", this.path);
		return stats ? stats.isFile() : false;
	}

	removeAllChildren(): Promise<OperationStatus> {
		return Functions.doSimpleAsync(FS, "rm", this.path, { recursive: true });
	}

	async delete(): Promise<OperationStatus> {
		let exists = await Functions.doAsync(this, "exists");
		if (!exists) {
			console.error("Folder does not exist: " + this.path);
			return "failure";
		}

		return this.removeAllChildren();
	}

	getChildrenNames(): Promise<string[]> {
		return Functions.doAsync(FS, "readdir", this.path, "utf-8") || [];
	}

	async getFolderNames(): Promise<string[]> {
		let childrenNames = await this.getChildrenNames();
		let promises = childrenNames.map(this.isDirectory, this);
		let isDirResults = await Promise.all(promises);
		return childrenNames.filter((name, index) => isDirResults[index] === true);
	}

	async getFileNames(): Promise<string[]> {
		let childrenNames = await this.getChildrenNames();
		let promises = childrenNames.map(this.isFile, this);
		let isFileResults = await Promise.all(promises);
		return childrenNames.filter((name, index) => isFileResults[index] === true);
	}

	create(options?: {recursive: boolean}): Promise<OperationStatus> {
		return Functions.doSimpleAsync(FS, "mkdir", this.path, options);
	}


	async createFolderIfMissing(folderName: string): Promise<OperationStatus> {
		let result: OperationStatus = "success";
		let childFolder = this.getChildFolder(folderName);
		let exists = await childFolder.exists();
		
		if (!exists) result = await childFolder.create({ recursive: true });
		
		return result;
	}
}

export default Folder;
