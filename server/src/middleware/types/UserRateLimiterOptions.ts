type UserRateLimiterOptions = {
	timeWindowInMs: number,
	maxCoins: number,
	decrementRate: number
}

export default UserRateLimiterOptions;
