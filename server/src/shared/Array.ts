const ExArray = {
	
	addAt: (array: any[], index: number, item: any): any[] => {
		array.splice(index, 0, item);
		return array;
	}
	
	,

	removeAt: (array: any[], index: number): any[] => {
		array.splice(index, 1);
		return array;
	}

	,
	
	removeById: (array: any[], id: string) => {
		let index = array.findIndex((item: any) => item.id === id);
		if (index >= 0) ExArray.removeAt(array, index);
	
		return array;
	}
	
	,

	replace: (array: any[], oldItem: any, newItem: any): any[] => {
		let index = array.indexOf(oldItem);
		array.splice(index, 1, newItem);
		return array;
	}
	
	,

	remove: (array: any[], item: any): any[] => {
		let index = array.indexOf(item);
		if (index >= 0) ExArray.removeAt(array, index);
	
		return array;
	}
	
	,

	isEmpty: (array: any[]): boolean => array.length === 0

	,

	last: (array: any[]): any => array[array.length - 1]

	,
	
	clone: (array: any[]): any[] => array.slice()
	
}

export default ExArray;