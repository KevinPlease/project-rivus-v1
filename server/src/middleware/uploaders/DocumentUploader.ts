import Multer from "multer";

import Folder from "../../files/Folder";
import { MessengerFunction } from "../../Messenger";
import { BaseUploader } from "./BaseUploader";
import IMiddlewareStorage from "./IMiddlewareStorage";

const LIMITS = {
	fileSize: 7e+7,
	files: 20
};


class DocumentUploader extends BaseUploader {

	public static create(storageMiddleware: IMiddlewareStorage, say: MessengerFunction) {
		const documentStorage = storageMiddleware.init(say);
		if (!documentStorage.storage) throw "DocumentUploader: Missing storage engine!";

		const options: Multer.Options = {
			dest: Folder.SYS_FOLDER,
			fileFilter: function (req, file, filterHandlerFunc) {
				filterHandlerFunc(null, true);
			},
			storage: documentStorage.storage,
			limits: LIMITS
		};
		return new DocumentUploader(options);
	}

}

export default DocumentUploader;
