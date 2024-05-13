import { Response as ExpResponse, NextFunction as ExpNextFunc } from "express";
import Multer from "multer";

import { MExpRequest } from "../../network/types/MExpRequest";

interface BaseUploaderOptions extends Multer.Options {}

class BaseUploader {
	private _options: BaseUploaderOptions;
	private _instance: Multer.Multer;

	constructor(options: Multer.Options) {
		this._options = options;
		this._instance = Multer(options);
	}

	public get options(): BaseUploaderOptions { return this._options }
	public get instance(): Multer.Multer { return this._instance }

	public callExpHandler(path: string, req: MExpRequest, res: ExpResponse, next: ExpNextFunc): void {
		return this._instance.array(path)(req, res, next);
	}
}


export { BaseUploader };
