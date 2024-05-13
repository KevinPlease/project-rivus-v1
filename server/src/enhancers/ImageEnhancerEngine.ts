import UrlUtils from "url";
const __dirname = UrlUtils.fileURLToPath(new UrlUtils.URL(".", import.meta.url));

import ImageEnhancer from "../backend/middlewares/ImageEnhancer";
import { Messenger, MessengerFunction } from "../Messenger";
import WorkDependency from "../service/types/WorkDependency";
import WorkerEngine from "../service/WorkerEngine";
import { Functions } from "../shared/Function";
import ImageEnhancement, { ImgEnhancementExecInfo, ImgEnhancementResult } from "./ImageEnhancement";

class ImageEnhancerEngine extends WorkerEngine<ImgEnhancementExecInfo> {

	public static create(type: string, say?: MessengerFunction) {
		if (!say) {
			const messenger = new Messenger(__dirname, false);
			say = messenger.say;
		}

		const engine = new ImageEnhancerEngine(type, say);
		
		if (process.send) {
			engine.initialize();
		}

		return engine;
	}

	public async handleMessage(dependency: WorkDependency<ImgEnhancementExecInfo>) {
		const workCore = dependency.core;
		if (!workCore) return console.error("ImageEnhancerEngine: Missing core in WorkDependency!");

		const imageEnhancement = new ImageEnhancement(workCore);
		this.curWork = imageEnhancement;
		this.dependencies = dependency.dependencies;
	
		const result = await Functions.doAsync(this, this.enhance);
		if (result) {
			imageEnhancement.finish("finished", { data: result });
			
		} else {
			console.error("ImageEnhancerEngine: Error in #handleMessage");
			imageEnhancement.finish("failed", { error: "ImageEnhancerEngine: Error in #handleMessage"});
		}
		
		super.handleMessage(dependency);
	}

	private async enhance(): Promise<ImgEnhancementResult> {
		if (!this.curWork) throw "ImageEnhancerEngine: Missing Work!";
		
		const execInfo = this.curWork.data.execInfo;
		const imgEnhancer = new ImageEnhancer();

		const onMessage = Functions.bound(this, this.onMessage);
		const proms = execInfo.images.map(img => imgEnhancer.enhance(img, onMessage));
		
		const status = await Functions.doSimpleAsync(Promise, "all", proms);

		return { data: status };
	}

}

export default ImageEnhancerEngine.create(ImageEnhancement.ROLE);
