import { RouteInfo } from "../../network/types/RoutesInfo";

type RequestAuthInfo = {
	authToken: string,
	branchName: string,
	domainName: string
} & RouteInfo;

export type { RequestAuthInfo };
