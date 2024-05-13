import NodeMailer from "nodemailer";

import { Functions, OperationStatus } from "../shared/Function";
import { MessengerFunction } from "../Messenger";

class Mail {
	private _from: string;
	private _to: string;
	private _transporter: NodeMailer.Transporter;

	constructor(to: string) {
		this._from = "TODO";
		this._to = to;
		this._transporter = NodeMailer.createTransport({
			host: "smtp.office365.com",
			secure: false,
			requireTLS: true,
			port: 587,
			tls: {
				rejectUnauthorized: false
			},
			auth: {
				user: this._from,
				pass: "TODO"
			},
		});
	}

	sendMail(token: string, domainName: string, say: MessengerFunction): Promise<OperationStatus> {
		// Set expiration time is 1 hour.
		let activeExpires: number = Date.now() + 60 * 60 * 1000;
		let hostUrl: string = say("ask", "hostUrlForDomain", domainName);
		let link = hostUrl + "/designer/passwordReset?activeToken=" + token + "&timestamp=" + activeExpires;

		let mailOptions = {
			from: this._from,
			to: this._to,
			subject: "Reset Password for your Dwiblo Account",
			html: "Please click <a href=\"" + link + "\"> here </a> to reset password of your account."
		};

		return Functions.doSimpleAsync(this._transporter, "sendMail", mailOptions);
	}
}

export default Mail;
