interface IDispatcher {
	dispatch<T>(event: string, arg?: T): any;
}

export default IDispatcher;
