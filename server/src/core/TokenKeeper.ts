import BCrypt from "bcrypt";
import TokenAuth from "jsonwebtoken";

import { MessengerFunction } from "../Messenger";
import { Functions } from "../shared/Function";

type PromiseCallback = (value: any) => any;

const saltRounds = 10;

// REVIEW the callback-based approach and the wrapper API of new Promise(...)
class TokenKeeper {
	private _validKey: string;
	
	constructor(validKey: string = "0") {
		this._validKey = validKey;
	}

	static getCallback(resolve: PromiseCallback, reject: PromiseCallback): TokenAuth.SignCallback | TokenAuth.VerifyCallback {
		return (err: Error | null, data: string | undefined) => {
			if (err) return reject(err);

			return resolve(data);
		};
	}


	static async areMatchingPasswords(newPassword: string, hashPass: string): Promise<boolean> {
		if (newPassword === "" && hashPass === "") return true;
		
		const operationStatus = await Functions.doSimpleAsync(BCrypt, "compare", newPassword, hashPass);
		return operationStatus === "success" ? true : false;
	}

	static encryptPass(password: string): string {
		if (!password) return "";

		return BCrypt.hashSync(password, saltRounds);
	}


	updateValidToken(say: MessengerFunction): string {
		let secretToken = say(this, "ask", "secretToken");
		let uniqueVarInfo = say(this, "ask", "uniqueVarInfo");
		return this._validKey = TokenAuth.sign(uniqueVarInfo, secretToken);
	}


	private _getTokenFromInfo(info: ObjectConstructor): Promise<string> {
		return new Promise((resolve: PromiseCallback, reject: PromiseCallback) => {
			let callback = TokenKeeper.getCallback(resolve, reject) as TokenAuth.SignCallback;
			return TokenAuth.sign(info, this._validKey, { algorithm: "HS256" }, callback);
		});
	}
	getTokenFromInfo(info: ObjectConstructor): Promise<string> {
		return Functions.doAsync(this, "_getTokenFromInfo", info);
	}


	private _decodeAndVerifyToken(token: string): Promise<any> {
		return new Promise((resolve: PromiseCallback, reject: PromiseCallback) => {
			let callback = TokenKeeper.getCallback(resolve, reject) as TokenAuth.VerifyCallback;
			return TokenAuth.verify(token, this._validKey, { algorithms: ["HS256"] }, callback);
		});
	}
	decodeAndVerifyToken(token: string): Promise<any> {
		return Functions.doQuietAsync(this, "_decodeAndVerifyToken", token);
	}
}

export default TokenKeeper;
