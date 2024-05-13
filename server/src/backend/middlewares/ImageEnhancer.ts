import ExJimp from "./Jimp";
import Folder from "../../files/Folder";

import { MessengerFunction } from "../../Messenger";
import { Functions } from "../../shared/Function";
import { Operation } from "../../types/Operation";
import IModelEnhancer from "../interfaces/IModelEnhancer";
import { ImageDetails } from "../types/ImageDetails";

class ImageEnhancer implements IModelEnhancer {
	
	async enhance(model: ImageDetails, say: MessengerFunction): Promise<Operation> {
		const filePath = Folder.createPath(say, model.fsPath, model.id);

		const options = {
			ratio: 0.2,		// Should be less than one
			opacity: 0.99, 	// Should be less than one
			dstPath: filePath,
			location: "top-right"
		};

		const waterMarkPath = Folder.createPath(say, "backend", "data", "watermark_simple.png");
		const status = await Functions.doSimpleAsync(ExJimp, "addWatermark", filePath, waterMarkPath, options);
		return { status, message: null };
	}

}

export default ImageEnhancer;
