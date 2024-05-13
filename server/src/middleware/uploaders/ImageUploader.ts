import Multer from "multer";

import Folder from "../../files/Folder";
import { MessengerFunction } from "../../Messenger";
import { BaseUploader } from "./BaseUploader";
import IMiddlewareStorage from "./IMiddlewareStorage";

const LIMITS = {
	fileSize: 2e+7,
	files: 20
};

class ImageUploader extends BaseUploader {

	public static create(storageMiddleware: IMiddlewareStorage, say: MessengerFunction) {
		const imageStorage = storageMiddleware.init(say);
		if (!imageStorage.storage) throw "ImageUploader: Missing storage engine!";

		const options: Multer.Options = {
			dest: Folder.SYS_FOLDER,
			fileFilter: function (req, file, filterHandlerFunc) {
				filterHandlerFunc(null, true);
			},
			storage: imageStorage.storage,
			limits: LIMITS
		};
		return new ImageUploader(options);
	}

}

export default ImageUploader;
