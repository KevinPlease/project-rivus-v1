import FS from "fs/promises";

import { Functions, OperationStatus } from "../shared/Function";
import { ExString } from "../shared/String";

const ENCODING_PER_TYPE = {
	"jpg": "binary",
	"jpeg": "binary",
	"pdf": "binary",
	"png": "binary",
	"text": "utf-8",
	"txt": "utf-8"
};

class File {
	private _path: string;
	private _name: string;
	private _extension: string;

	constructor(ownPath: string, name: string, extension: string) {
		this._path = ownPath;
		this._name = name;
		this._extension = extension;
	}

	public static timestampedName(name: string, extension?: string) : string {
		if (name.includes("-ubrix-")) {
			name = ExString.sinceAfter(name, "-ubrix-");
		}

		if (!extension) {
			extension = "";
		}

		return Date.now() + "-ubrix-" + name.toLowerCase() + extension;
	}

	public get path(): string { return this._path }

	static fromInfo(path: string, fullName: string): File {
		let name = ExString.upToBeforeLast(fullName, ".");
		let extension = ExString.sinceAfterLast(fullName, ".");
		return new File(path, name, extension);
	}

	static fromPath(path: string): File {
		let fullName = ExString.sinceAfterLast(path, "/");
		let name = ExString.upToBeforeLast(fullName, ".");
		let extension = ExString.sinceAfterLast(fullName, ".");
		return new File(path, name, extension);
	}
	
	async exists(): Promise<boolean> {
		let result = await Functions.doAsync(FS, "access", this.path);
		return result === null ? false : true;
	}

	append(content: string): Promise<OperationStatus> {
		return Functions.doSimpleAsync(FS, "appendFile", this.path, content);
	}
	
	
	copy(destinationPath: string): Promise<OperationStatus> {
		return Functions.doAsync(FS, "copyFile", this.path, destinationPath);
	}
	
	
	writeWithEncoding(content: string, type: string): Promise<OperationStatus> {
		if (!type) type = "utf-8";

		if (typeof content != "string") {
			content = JSON.stringify(content);
		}

		return Functions.doAsync(FS, "writeFile", this.path, content, type);
	}
	
	
	write(content: string): Promise<OperationStatus> {
		let encodingType = ENCODING_PER_TYPE[this._extension];
		return this.writeWithEncoding(content, encodingType);
	}
	
	
	readWithEncoding(type: string): Promise<string> {
		if (!type) type = "utf-8";
		return Functions.doAsync(FS, "readFile", this.path, type);
	}
	
	
	read(): Promise<string> {
		let encodingType = ENCODING_PER_TYPE[this._extension];
		return this.readWithEncoding(encodingType);
	}
}

export default File;
