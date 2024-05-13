import Multer from "multer";

import File from "../../files/File";
import { MessengerFunction } from "../../Messenger";
import { MExpRequest } from "../../network/types/MExpRequest";
import NetworkUrl from "../../network/NetworkUrl";
import ModelFolder from "../../files/ModelFolder";
import IMiddlewareStorage from "./IMiddlewareStorage";

class ImageStorage implements IMiddlewareStorage {
	private _storage: Multer.StorageEngine | null;
	private _role: string;

	constructor(modelRole: string) {
		this._role = modelRole;
		this._storage = null;
	}

	public get storage(): Multer.StorageEngine | null { return this._storage }

	public init(say: MessengerFunction): ImageStorage {
		const ownDomain = say(ImageStorage, "ask", "ownDomain");
		const ownBranch = say(ImageStorage, "ask", "ownBranch");
		let firstTime = true;

		const role = this._role;
		const storage = Multer.diskStorage({
			destination: async function (req, file, destHandlerFunc) {
				const propFolder = ModelFolder.fromInfo(role, ownDomain.name, ownBranch.data.name, req.body.id, say);
				
				if (firstTime) {
					await propFolder.ensureImagesExist(say);
					firstTime = false;
				}
				
				const path = propFolder.getImagesPath(say);
				const fileName = File.timestampedName(file.originalname);
				
				file.filename = fileName;
				file.path = NetworkUrl.forImage(ownDomain.name, ownBranch.data.name, role, req.body.id, fileName, say);
				// @ts-ignore
				file.fsPath = path;
				destHandlerFunc(null, path);
			},
			filename: function (req: MExpRequest, file, nameHandlerFunc) {
				if (!req.uploadedFiles) req.uploadedFiles = [];
				// @ts-ignore
				req.uploadedFiles.push({ src: file.path, name: file.filename, fsPath: file.fsPath, originalName: file.originalname });

				nameHandlerFunc(null, file.filename);
			}
		});

		this._storage = storage;
		return this;
	}
}

export default ImageStorage;
