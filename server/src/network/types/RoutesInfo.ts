import { MethodType } from "../Request";

type RouteInfo = {
	actionId: string,
	needsAuth?: boolean
}

type RawRouteInfo = {
	actionName: string,
	needsAuth?: boolean
}

type ResourceInfo = Record<string, RouteInfo>;
type RawResourceInfo = Record<string, RawRouteInfo>;

type RoutesInfo = Partial<Record<MethodType, ResourceInfo>>;
type RawRoutesInfo = Partial<Record<MethodType, RawResourceInfo>>;

export type { RawRouteInfo, RawResourceInfo, RawRoutesInfo, RoutesInfo, RouteInfo, ResourceInfo };
