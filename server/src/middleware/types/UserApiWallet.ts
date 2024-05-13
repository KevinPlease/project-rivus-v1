class UserApiWallet {
	private _id: string;
	private _timestamp: number;
	private _coins: number;
	private _startingCoins: number;

	constructor(id: string, timestamp: number, coins: number) {
		this._id = id;
		this._timestamp = timestamp;
		this._coins = coins;
		this._startingCoins = coins;
	}

	public static create(id: string, startingCoins: number) : UserApiWallet {
		const timestamp = Date.now();
		return new UserApiWallet(id, timestamp, startingCoins);
	}

	public get id(): string {
		return this._id;
	}

	public get timestamp(): number {
		return this._timestamp;
	}

	public spendCoins(amount: number) : number {
		this._coins = this._coins - amount;
		return this._coins
	}

	public hasCoins() : boolean {
		return this._coins > 0;
	}

	public reset() {
		this._timestamp = Date.now();
		this._coins = this._startingCoins;
	}

}

export default UserApiWallet;
