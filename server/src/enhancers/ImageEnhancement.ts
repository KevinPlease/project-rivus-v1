import IdCreator from "../backend/IdCreator";
import Work, { WorkData, WorkSchedule } from "../service/Work";
import ExObject from "../shared/Object";
import { ModelCore } from "../core/Model";
import { MessengerFunction } from "../Messenger";
import Metadata from "../core/types/Metadata";
import OwnershipInfo from "../backend/types/OwnershipInfo";
import { ImageDetails } from "../backend/types/ImageDetails";


type ImgEnhancementExecInfo = {
	branch: string;
	domain: string;
	propertyId: string;
	images: ImageDetails[];
};

type ImgEnhancementResult = {
	data: any;
}

type ImgEnhancementData = WorkData<ImgEnhancementExecInfo>;

class ImageEnhancement extends Work<ImgEnhancementExecInfo> {

	public static ROLE = "image_enhancement";
	// NOTE: Currently no repo for this type of work
	public static REPO_NAME = "image_enhancements";

	public static emptyData(): ImgEnhancementData {
		return {
			schedule: WorkSchedule.empty(),
			groupId: "default",
			execInfo: {
				branch: "",
				domain: "",
				propertyId: "",
				images: []
			},
			result: {},
			status: "pending",
			priority: 0
		};
	}

	public static create(say: MessengerFunction, data: ImgEnhancementData, ownership: OwnershipInfo, meta?: Metadata): ImageEnhancement {
		if (ExObject.isDictEmpty(data)) data = ImageEnhancement.emptyData();
		
		if (!ownership.branch) throw "HUNT: Missing branch from ownership info!";

		const repository = IdCreator.createBranchedRepoId(ImageEnhancement.REPO_NAME, ownership.branch, ownership.domain);

		const now = Date.now();
		const creator = say(this, "ask", "ownUserId");
		if (!meta) meta = { timeCreated: now, timeUpdated: now, creator };

		const core: ModelCore<ImgEnhancementData> = { repository, role: ImageEnhancement.ROLE, data, meta };
		return new ImageEnhancement(core);
	}

	public static fromInfo(say: MessengerFunction, info: ImgEnhancementExecInfo, ownership: OwnershipInfo, meta?: Metadata): ImageEnhancement {
		const schedule = WorkSchedule.empty();
		const workData: ImgEnhancementData = { groupId: ImageEnhancement.ROLE, execInfo: info, priority: 0, result: {}, schedule, status: "pending" };
		const hunt = ImageEnhancement.create(say, workData, ownership, meta);
		
		hunt.id = "";

		return hunt;
	}

	public static request<ImgEnhancementExecInfo>(execInfo: ImgEnhancementExecInfo, say: MessengerFunction): Promise<Work<ImgEnhancementExecInfo>> {
		return say(this, "ask", ImageEnhancement.ROLE, execInfo) as Promise<Work<ImgEnhancementExecInfo>>;
	}

}

export default ImageEnhancement;
export type { ImgEnhancementExecInfo, ImgEnhancementData, ImgEnhancementResult };
