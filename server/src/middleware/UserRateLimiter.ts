import Cache from "../core/Cache";
import IRateLimiter from "./interfaces/IRateLimiter";
import { Conformity } from "./types/Conformity";
import { RequestConformityInfo } from "./types/RequestConformityInfo";
import UserApiWallet from "./types/UserApiWallet";
import UserRateLimiterOptions from "./types/UserRateLimiterOptions";

class UserRateLimiter implements IRateLimiter {
	
	private _options: UserRateLimiterOptions;
	private _cache: Cache<UserApiWallet>;

	constructor(options: UserRateLimiterOptions) {
		this._options = options;
		this._cache = new Cache();
	}

	public static create() : UserRateLimiter {
		const options : UserRateLimiterOptions = {
			timeWindowInMs: 10000,
			decrementRate: 1,
			maxCoins: 50
		};

		return new UserRateLimiter(options);
	}

	public conform(data: RequestConformityInfo): Conformity {
		const cache = this._cache;
		const userId = data.userId;
		
		let userWallet = cache.getBy(userId);
		if (!userWallet) {
			userWallet = UserApiWallet.create(userId, this._options.maxCoins);
			cache.set(userWallet);
			return { isOk: true };
		}
		
		let isOk: boolean;
		if (this.isWindowClosedForWallet(userWallet)) {

			if (userWallet.hasCoins()) {
				userWallet.spendCoins(this._options.decrementRate);
				isOk = true;
			} else {
				isOk = false;
			}

		} else {
			userWallet.reset();
			isOk = true;
		}

		return { isOk };
	}

	private isWindowClosedForWallet(wallet: UserApiWallet) : boolean {
		return Date.now() - wallet.timestamp < this._options.timeWindowInMs;
	}

}

export default UserRateLimiter;
