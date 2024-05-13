import Multer from "multer";
import { MessengerFunction } from "../../Messenger";

interface IMiddlewareStorage {
	storage: Multer.StorageEngine | null;
	
	init(say: MessengerFunction): IMiddlewareStorage;
}

export default IMiddlewareStorage;
