import { MessengerFunction } from "../Messenger";
import Time from "./Time";

class Logger {
	private _msngr: MessengerFunction;

	constructor(msngr: MessengerFunction) {
		this._msngr = msngr;
	}


	static formattedLog(sourceName: string, date: Date, content: Object | string): string {
		if (content instanceof Object) content = JSON.stringify(content);

		sourceName = sourceName ? `${sourceName} : ` : "";

		let time = Time.fromDate(date);
		return time + " -- " + sourceName + content;
	}


	static logFromInfo(source: any, content: string): string {
		source = source instanceof Object ? source.constructor.name : source;

		let curDate = new Date();
		return Logger.formattedLog(source, curDate, content);
	}


	writeLog(log: string, what: string) {
		return console.error("WIP");

		// let now = new Date();
		// let year = now.getFullYear();
		// let month = now.getMonth() + 1;
		// let date = now.getDate(); 
		// let fileName = `${year}-${month}-${date}` + ".txt";
	
		// const LOGS_FOR = CFG.global.LOGS_FOR;
		// let logsFolder = this.folder.newChild(LOGS_FOR.ROOT);
		// let folderName = LOGS_FOR.SYSTEM;
		// let message = `\n${log}\n`;
	
		// if (what === "apiLogging") {
		// 	folderName = LOGS_FOR.API;
		// 	message = log;
		// }
	
		// let targetFolder = logsFolder.newChild(folderName);
		// return targetFolder.appendFile(fileName, message, this.msngr);
	}
}

export default Logger;
