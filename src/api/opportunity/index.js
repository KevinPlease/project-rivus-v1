import BaseAPI from "../BaseAPI.js";
import { GROUP_FIELDS } from "../Fields";

class OpportunityAPI extends BaseAPI {

  static MODEL_NAME = "opportunity";
  static MODEL_NAME_PLURAL = "opportunities";

  constructor() {
    super(OpportunityAPI.MODEL_NAME, OpportunityAPI.MODEL_NAME_PLURAL);
  }

  static defaultPriorities() {
    return {
      propertyType: 0.7,
			country: 1,
			city: 1,
			zone: 1,
			price: 1,
			currency: 1,
			details: {
				livingRoomCount: 0.7,
				kitchenCount: 0.7,
				bedroomCount: 0.7,
				bathroomCount: 0.7,
				constructionYear: 0.7,
				furniture: 0.7,
				luxury: 0.7,
				grossArea: 0.7,
				interiorArea: 0.7,
				landArea: 0.7
			}
    };
  }

  static prioritiesFromValues(priorities) {
    const prioritiesToSend = OpportunityAPI.defaultPriorities();
    const innerDetails = prioritiesToSend.details;

    for (let index = 0; index < priorities.length; index += 1) {
      const priority = priorities[index];
      const value = 1 - (index / priorities.length);
      const boundValue = Math.min(Math.max(value, 0.5), 1);
      const fixedValue = Number(boundValue.toFixed(1));

      const prioId = priority._id;
      if (prioId === GROUP_FIELDS.ROOMS_SPACES) {
        innerDetails.bathroomCount = fixedValue;
        innerDetails.bedroomCount = fixedValue;
        innerDetails.livingRoomCount = fixedValue;
        innerDetails.kitchenCount = fixedValue;
        innerDetails.grossArea = fixedValue;
        innerDetails.interiorArea = fixedValue;
        innerDetails.landArea = fixedValue;
        innerDetails.propertyType = fixedValue;

      } else if (prioId === GROUP_FIELDS.LOCATION) {
        prioritiesToSend.country = fixedValue;
        prioritiesToSend.city = fixedValue;
        prioritiesToSend.zone = fixedValue;

      } else {
        prioritiesToSend[prioId] = fixedValue;
      }

    }

    return prioritiesToSend;
  }

  updateWithPriorities(authInfo, opportunityId, data, priorities) {
    let hunt;
    if (priorities.length > 0) {
      hunt = OpportunityAPI.prioritiesFromValues(priorities);
    } else {
      hunt = OpportunityAPI.defaultPriorities();
    }

    data.hunt = hunt;
    data.hunt._raw = priorities;

    return this.update(authInfo, opportunityId, data);
  }
  
}

const opportunityAPI = new OpportunityAPI();
export default opportunityAPI;
export { OpportunityAPI }
