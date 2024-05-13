import Next from "next";
import { NextServer } from "next/dist/server/next";
import Express from "express";
import https from "https";
import Cors from "cors";
import BodyParser from "body-parser";

import { MessengerFunction } from "../Messenger";
import { ExString } from "../shared/String";
import NetworkUrl from "../network/NetworkUrl";

// Import router classes here
import ApiRouter from "../api/ApiRouter";
import { Response } from "../network/Response";
import { Communicator } from "../communications/Communicator";
import { AdminRouter } from "../admin/AdminRouter";
import { RoleAuthorizer } from "../middleware/RoleAuthorizer";
import { UserAuthorizer } from "../middleware/UserAuthorizer";
import UserRateLimiter from "../middleware/UserRateLimiter";

import API_ROUTES from "../api/routes";
import ADMIN_ROUTES from "../admin/routes";
import { BranchAuthorizer } from "../middleware/BranchAuthorizer";
import { DomainAuthorizer } from "../middleware/DomainAuthorizer";

const NON_NEXT_ROUTES = ["admin", "api"];

/**
 * The entry point for the server configurations and initating the connection.
 *
 **/
class WebServer extends Communicator {
	private _nextServer: NextServer;
	private _express: Express.Express;
	private _config: {};
	private _msngr: MessengerFunction;
	private _sessCounter: number;
	private _serverStartToken: number;

	constructor(nextServer: NextServer, express: Express.Express, config: {}, msngr: MessengerFunction) {
		super();

		this._nextServer = nextServer;
		this._express = express;
		this._config = config;
		this._msngr = msngr;

		this._sessCounter = 0;
		this._serverStartToken = 0;
	}


	public get serverStartToken(): number { return this._serverStartToken }

	
	static async fromParts(config: {}, say: MessengerFunction): Promise<WebServer> {
		let webServer: WebServer;

		const msngr: MessengerFunction = (source, purpose, what, content) => {
			if (purpose === "ask") {
				switch (what) {
					case "session": return webServer._sessCounter;
				}
			}

			return say(source, purpose, what, content);
		};

		const CONNECTION_MODE = say(WebServer, "ask", "connectionMode");
		const isDev = CONNECTION_MODE === "development";
		const nextServer = Next({ dev: isDev });
		const nextServerHandle = nextServer.getRequestHandler();

		await nextServer.prepare();
		
		let express = Express();
		webServer = new WebServer(nextServer, express, config, msngr);

		express.use(Cors());
		express.use(BodyParser.json({limit: "100mb"}));

		express.get("*", (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
			const word = ExString.betweenFirstTwo(req.path, "/");
			if (NON_NEXT_ROUTES.includes(word)) return next();
			
			nextServerHandle(req, res);
		});

		if (isDev) { // localhost does not have two "." chars i.e: rivus.localhost:5000
			express.set("subdomain offset", 1);
		}

		await webServer.createRouters(msngr);
		webServer.startSubscription();

		return webServer;
	}
	

	say(purpose: string, what: string, content?: any) { return this._msngr(this, purpose, what, content) }


	async createRouters(msngr: MessengerFunction) {
		const express = this._express;
		const apiRouter = await ApiRouter
			.create(Express.Router(), API_ROUTES, msngr)
			.addAuthMiddleware	(new DomainAuthorizer())
			.addAuthMiddleware	(new BranchAuthorizer())
			.addAuthMiddleware	(new UserAuthorizer())
			.addAuthMiddleware	(new RoleAuthorizer())
			.addRateLimiter		(UserRateLimiter.create())
			.init();
		express.use("/api", apiRouter.expRouter);

		const adminRouter = await AdminRouter
			.create(Express.Router(), ADMIN_ROUTES, msngr)
			.addAuthMiddleware	(new DomainAuthorizer())
			.addAuthMiddleware	(new BranchAuthorizer())
			.addAuthMiddleware	(new UserAuthorizer())
			.addRateLimiter		(UserRateLimiter.create())
			.init();
		express.use("/admin/api", adminRouter.expRouter);
	}


	startSubscription() {
		// this.subscribe("api logging", (source, arg) => this.informApiLogging(source as Response<any>));
		this.subscribe("session started", (source, arg) => this._sessCounter += 1);
	}


	handleSecureRedirection(req: Express.Request, res: Express.Response, next: Express.NextFunction): void {
		if (!this.needsHttps(req)) {
			const nextServerHandle = this._nextServer.getRequestHandler();
			nextServerHandle(req, res);
			return;
		}
			
		return res.redirect("https://" + req.headers.host + req.url);
	}

	
	informApiLogging(source: Response<any>): void {
		let session = this._sessCounter;
		let isVerbose = this.say("ask", "isVerbose");
		let content = isVerbose ? source.getVerboseLog(session) : source.getTerseLog(session);
		// TODO: Application should subscribe to this when Logging is functional through the Logger class.
		this.dispatch("log api", content);
		return;
	}


	needsHttps(request: Express.Request): boolean {
		const CONNECTION_MODE = this.say("ask", "connectionMode");
		const protocolFromConfig = this._config[CONNECTION_MODE].protocol;
		return protocolFromConfig === "https" && !request.secure;
	}

	
	createAndListenSecurely(certificationInfo: {}, startedListening: () => void): void {
		const CONNECTION_MODE = this.say("ask", "connectionMode");
		const CONN = this._config[CONNECTION_MODE];
		
		const express = this._express;
		const httpsServer = https.createServer(certificationInfo, express);
		httpsServer.listen(CONN.PORT, startedListening);
		express.listen(CONN.PORT + 1);
	}


	/**
	 * Start listening on the specified port
	 */
	start(): void {
		const CONNECTION_MODE = this.say("ask", "connectionMode");
		const CONN = this._config[CONNECTION_MODE];
		const onServerStarted = () => {
			console.log("Server is running on port: " + CONN.PORT);
			this._serverStartToken = Date.now();
			this.dispatch("server connected", "success from dispatcher");
		};

		if (CONNECTION_MODE === "development" || CONNECTION_MODE === "testing") {
			this._express.listen(CONN.PORT, CONN.URL, onServerStarted);
			return;
		}

		let certificationInfo = this.say("ask", "certificationInfo");
		this.createAndListenSecurely(certificationInfo, onServerStarted);
	}


	getHostUrlForDomain(domainName: string): string {
		const CONNECTION_MODE = this.say("ask", "connectionMode");
		let config = this._config;
		let configForMode = config[CONNECTION_MODE];

		let protocol = config[CONNECTION_MODE].protocol;
		let subdomain = domainName.toLowerCase();
		let host = ExString.deprefix(configForMode.DOMAIN_NAME, `${subdomain}.`);
		let port = CONNECTION_MODE === "development" ? configForMode.PORT : null;
		return NetworkUrl.fromParts(protocol, subdomain, host, port);
	}
}

export default WebServer;
