const Fields = {
	DISPLAY_ID: "displayId",
	TITLE: "title",
	SOURCE: "source",
	ASSIGNEE: "assignee",
	ADDRESS: "address",
	OWNER: "owner",
	BUSINESS_TYPE: "businessType",
	PROPERTY_TYPE: "propertyType",
	COUNTRY: "country",
	FULL_NAME: "fullName",
	NAME: "name",
	CITY: "city",
	ZONE: "zone",
	PRICE: "price",
	PRICE_FROM: "price.from",
	PRICE_TO: "price.to",
	AVAILABILITY: "availability",
	HAS_MORTGAGE: "hasMortgage",
	NO_MORTGAGE: "noMortgage",
	DATE_CREATED: "meta.timeCreated"
};

const RANGED_FIELDS = {
	PRICE_FROM: "ranged_" + Fields.PRICE_FROM,
	PRICE_TO: "ranged_" + Fields.PRICE_TO
};

const IdFields = {
	SOURCE: Fields.SOURCE + "._id",
	ASSIGNEE: Fields.ASSIGNEE + "._id",
	OWNER: Fields.OWNER + "._id",
	BUSINESS_TYPE: Fields.BUSINESS_TYPE + "._id",
	AVAILABILITY: Fields.AVAILABILITY + "._id",
	HAS_MORTGAGE: Fields.HAS_MORTGAGE + "._id",
};

const GROUP_FIELDS = {
	ROOMS_SPACES: "_roomsAndSpaces",
	LOCATION: "_location"
};


export { Fields, IdFields, GROUP_FIELDS, RANGED_FIELDS };
