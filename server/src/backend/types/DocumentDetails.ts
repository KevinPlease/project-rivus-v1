type DocumentDetails = {
	alt: string;
	src: string;
	url: string;
	isRemoved?: boolean;
	isImg: boolean;
	id: string;
	fsPath: string;
	file: {
		name: string;
		size: number;
		type: string;
	};
};

export type { DocumentDetails };
