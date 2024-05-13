import { ExString } from "../shared/String";

class Time {
	
	static fromDate(date: Date): string {
		let mins = date.getMinutes();
		let secs = date.getSeconds();
		let minString = ExString.zeroPrefixed(mins);
		let secString = ExString.zeroPrefixed(secs);
		let hours = date.getHours();
		return hours + ":" + minString + ":" + secString;
	}
	
	static now(): string {
		return Time.fromDate(new Date());
	}
	
}

export default Time;
