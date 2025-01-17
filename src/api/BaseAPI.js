import Network from "./Network";
import Filter from "./Filter";

class BaseAPI {

  static FORM = "form";
  static IMAGE = "image";
  static REPORT = "report";
  static SYNC = "sync";
  static IMAGES = BaseAPI.IMAGE + "s";
  static DOCUMENT = "document";
  static DOCUMENTS = BaseAPI.DOCUMENT + "s";

  constructor(modelName, plural) {
    this.api = {
      single: modelName,
      many: plural,
      
      formDetails:  modelName + "/" + BaseAPI.FORM        ,
      image:        modelName + "/" + BaseAPI.IMAGE       ,
      report:       modelName + "/" + BaseAPI.REPORT       ,
      images:       modelName + "/" + BaseAPI.IMAGES      ,
      document:     modelName + "/" + BaseAPI.DOCUMENT    ,
      documents:    modelName + "/" + BaseAPI.DOCUMENTS
    };

    this.network = new Network();
  }

  static emptyAPI() {
    return new BaseAPI();
  }

  static authForInfo(user) {
    return { branch: user.branch, token: user.data.token };
  }

  async getAll(authInfo, searchData) {
    const filter = Filter.fromData(searchData.filterTypes, searchData.filters, searchData.pageNr, searchData.itemsPerPage);
    const response = await this.network.callGetAPI(authInfo, this.api.many, filter);
    if (response.status === "failure") return null;

    return response.data[this.api.many];
  }

  async getFormDetails(authInfo) {
    const response = await this.network.callGetAPI(authInfo, this.api.formDetails);
    if (response.status === "failure") return null;
    
    return response.data.formDetails;
  }

  async getById(authInfo, id) {
    const idQuery = { id };
    const response = await this.network.callGetAPI(authInfo, this.api.single, idQuery);
    if (response.status === "failure") return null;

    return response.data[this.api.single];
  }

  async create(authInfo, data, query) {
    const response =  await this.network.callPostAPI(authInfo, this.api.single, query, data);
    if (response.status === "failure") return null;

    return response.data[this.api.single];
  }

  update(authInfo, id, data) {
    const body = {
      _id: id,
      data
    };
    return this.network.callPutAPI(authInfo, this.api.single, body);
  }

  delete(authInfo, id) {
    const query = { id };
    return this.network.callDeleteAPI(this.api.single, query, authInfo);
  }

  uploadImages(authInfo, modelId, imageFiles) {
    const data = {
      id: modelId,
      images: imageFiles
    };
    return this.network.callPostAPI(authInfo, this.api.images, null, data, true);
  }

  async getImageByIds(authInfo, modelId, imageId) {
    const idQuery = { imageId };
    const modelIdParams = [ modelId ];
    const response = await this.network.callGetAPI(authInfo, this.api.image, idQuery, modelIdParams);
    if (response.status === "failure") return null;

    return response.data;
  }

  uploadDocuments(authInfo, modelId, docFiles) {
    const data = {
      id: modelId,
      documents: docFiles
    };
    return this.network.callPostAPI(authInfo, this.api.documents, null, data, true);
  }

  downloadDocument(authInfo, url) {
    return this.network.callAbsoluteGetAPI(authInfo, url, "file");
  }

  async getDocumentByIds(authInfo, modelId, documentId) {
    const idQuery = { documentId };
    const modelIdParams = [ modelId ];
    const response = await this.network.callGetAPI(authInfo, this.api.document, idQuery, modelIdParams);
    if (response.status === "failure") return null;

    return response.data;
  }

  async downloadReportByIds(authInfo, modelId, reportId) {
    if (!reportId) reportId = Date.now();
    const idQuery = { reportId };
    const modelIdParams = [ modelId ];
    const response = await this.network.callGetAPI(authInfo, this.api.report, idQuery, modelIdParams, "file");
    if (response.status === "failure") return null;

    return response;
  }

  async getSyncInfo(authInfo, lastSyncTime) {
    const idQuery = { lastSyncTime };
    const response = await this.network.callGetAPI(authInfo, this.api.sync, idQuery);
    if (response.status === "failure") return null;

    return response.data[BaseAPI.SYNC];
  }

}

export default BaseAPI;
