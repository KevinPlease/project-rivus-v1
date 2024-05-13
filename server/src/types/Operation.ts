type OperationStatus = "failure" | "success";

type Operation = {
	message: any,
	status: OperationStatus
}

export type { Operation, OperationStatus };
