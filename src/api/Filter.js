import { ExString } from "server/src/shared/String";
class Filter {

  static shouldSkipField(value) {
    if (Array.isArray(value)) return value.length === 0;

    if (typeof value === "object") return Object.keys(value) === 0;

    return value === "" || value === null || value === undefined;
  }

  static _fromData(fieldName, searchValue) {
    const data = {};
    let type = "basic";
    let values = [];

    if (searchValue.from !== undefined || searchValue.to !== undefined || fieldName.startsWith("ranged_")) {
      type = "range";
      values = [searchValue.from, searchValue.to];
      fieldName = ExString.deprefix(fieldName, "ranged_");
    } else if (Array.isArray(searchValue)) {
      values = searchValue;
    } else if (typeof searchValue === "object") {   // NOTE: case of nested objects like filters.bedroomCount.from

      for (let innerFName in searchValue) {
        const innerSearchVal = searchValue[innerFName];
        if (innerSearchVal.from !== undefined || innerSearchVal.to !== undefined || innerFName.startsWith("ranged_")) {
          type = "range";
          values = [innerSearchVal.from, innerSearchVal.to];
          innerFName = ExString.deprefix(innerFName, "ranged_");
        } else if (Array.isArray(innerSearchVal)) {
          values = innerSearchVal;
        } else {
          values = [innerSearchVal];
        }

        data[`${fieldName}.${innerFName}`] = {
          comparator: "INCLUDES",
          type,
          values
        };
      }
    } else {
      values = [searchValue];
    }

    data[fieldName] = {
      comparator: "INCLUDES",
      type,
      values
    };

    return data;
  }

  static fromData(filterTypes, data, pageNr, itemsPerPage) {   // data => { name: "search value", ... }
    const searchFilter = {
      filter: [],
      pagination: {}
    };

    for (const type in filterTypes) {
      const fieldNames = filterTypes[type];

      for (const fieldName of fieldNames) {
        const filterData = data[fieldName];
        if (Filter.shouldSkipField(filterData)) continue;

        const fieldFilterData = Filter._fromData(fieldName, filterData);

        const existingFilter = searchFilter.filter.find(sFilter => sFilter.type === type);
        if (existingFilter) {
          existingFilter.data = {
            ...existingFilter.data,
            ...fieldFilterData
          };
        } else {
          const filter = {
            type,
            data: fieldFilterData
          };
          searchFilter.filter.push(filter);
        }
        
      }
    }

    if (pageNr !== undefined) {
      searchFilter.pagination.pageNr = pageNr;
    }

    if (itemsPerPage !== undefined) {
      searchFilter.pagination.itemsPerPage = itemsPerPage;
    }

    return searchFilter;
  }

}

export default Filter;
