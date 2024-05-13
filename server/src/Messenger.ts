import Time from "./core/Time";

type MessengerFunction = (source: Object, purpose: string, what: string, msgContent?: any) => any;

class Message {
	private _sourceName: string;
	private _content: any;
	private _purpose: string;
	private _what: string;
	private _date: Date;
	
	constructor(sourceName: string, purpose: string, what: string, content?: any) {
		this._sourceName = sourceName;
		this._content = content;
		this._purpose = purpose;
		this._what = what;
		this._date = new Date();
	}
	/**
	 * Returns a formatted string to display the message time, source and content.
	 */
	toString(): string {
		let content = this._content;
		if (content instanceof Object) content = JSON.stringify(content);

		let sourceName = this._sourceName;
		sourceName = sourceName ? `${sourceName} : ` : "";
		
		let time = Time.fromDate(this._date);
		return time + " -- " + sourceName + content;
	}
}


class Messenger {
	private _context: string;
	private _verboseEnabled: boolean;
	
	constructor(context: string, verboseEnabled: boolean) {
		this._context = context;
		this._verboseEnabled = verboseEnabled;
	}

	say(source: Object | string, purpose: string, what: string, msgContent?: any): any {
		let sourceName = typeof source === "string" ? source : source.constructor.name;
		let src = `${this._context}:${sourceName}`;
		let msg = new Message(src, purpose, what, msgContent).toString();

		if (purpose === "log" || purpose === "inform") {
			console.info(msg);
		} else if (purpose === "verboseLog") {
			if (!this._verboseEnabled) return;

			console.log(msg);
		}

		return msg;
	}
}

export { Message, Messenger };
export type { MessengerFunction };

