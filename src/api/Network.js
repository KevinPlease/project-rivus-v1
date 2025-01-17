import { ExString } from "server/src/shared/String";

import ENV from "../../env";
const API_URL = ENV.APP_API;

class Network {
  static createHeaders(authToken, branchName, extraHeaders, isMultiPart) {
    if (!extraHeaders) extraHeaders = isMultiPart ? {} : {"Content-Type": "application/json"};

    return new Headers({
      "Authorization": authToken,
      "branch": branchName,
      ...extraHeaders
    });
  };

  static createQueryFromObj(dataObj) {
    const queryBuffer = ["?"];

    for (const key in dataObj) {
      let value = dataObj[key];
      if (value === undefined || value === null) continue;

      if (value instanceof Object) value = encodeURIComponent(JSON.stringify(value));
      queryBuffer.push(key, "=", value, "&");
    }

    return queryBuffer.join("");
  };

  static createFormData(data) {
    const formData  = new FormData();

    for(const name in data) {
      const item = data[name];

      if (Array.isArray(item)) {
        item.forEach(it => formData.append(name, it));
      } else {
        formData.append(name, item);
      }
    }

    return formData;
  }

  async callAPI(url, params, responseType, isMultiPart, authInfo = {}) {
    if (!responseType) responseType = "json";

    let data = {};
    let status = "success";

    try {
      const headers = Network.createHeaders(authInfo.token, authInfo.branch, params.headers, isMultiPart);
      const method = params.method;
      const requestParams = { headers, method };

      if (method !== "GET") {
        const body = params.body;
        let fBody = "";
        if (body) {
          fBody = isMultiPart ? body : JSON.stringify(body);
        }
        requestParams.body = fBody;
      }

      const response = await fetch(encodeURI(url), requestParams);
      
      let result = response;
      if (result.ok) {
        if (responseType === "file") {
          const cdispHeader = result.headers.get("content-disposition");
          const filename = ExString.betweenFirstTwo(cdispHeader, "\"") || "download";
          const blob = await response.blob();
          result = {
            content: new File([blob], filename),
            status: 200
          };
  
        } else {
          result = await response[responseType]();
  
        }
      }

      status = result?.status === 200 ? "success" : "failure";
      data = result.content || result;

    } catch (error) {
      console.error(error.stack);
      status = "failure";
    }

    return { status, data };
  };


  async callGetAPI(authInfo, endpoint, query, pathParams, responseType) {
    const params = {
      method: "GET"
    };
    
    const queryStr = query ? Network.createQueryFromObj(query) : "";
    const strPathParams = pathParams ? pathParams.join("/") : "";
    const url = API_URL + "/" + endpoint + "/" + strPathParams + queryStr;
    const response = await this.callAPI(url, params, responseType, false, authInfo);

    if (response.status === "failure") {
      response.data = `Problem getting ${endpoint}!`;
    }

    return response;
  };

  async callAbsoluteGetAPI(authInfo, absoluteUrl, responseType) {
    const params = {
      method: "GET"
    };
    
    const response = await this.callAPI(absoluteUrl, params, responseType, false, authInfo);

    if (response.status === "failure") {
      response.data = `Problem getting ${absoluteUrl}!`;
    }

    return response;
  };


  async callPostAPI(authInfo, endpoint, query, data, isMultiPart) {
    const queryStr = query ? Network.createQueryFromObj(query) : "";
    const body = isMultiPart ? Network.createFormData(data) : data;

    const params = {
      body,
      method: "POST"
    };

    const url = API_URL + "/" + endpoint + queryStr;
    const response = await this.callAPI(url, params, "json", isMultiPart, authInfo);

    if (response.status === "failure") {
      response.data = `Problem posting ${endpoint}!`;
    }

    return response;
  };

  async callStreamAPI(authInfo, endpoint, body, handleTextStream){
    const headers = Network.createHeaders(authInfo.token, authInfo.branch);
    
    const url = API_URL + endpoint;
    const response = await fetch(encodeURI(url), {
      method: "POST",
      headers,
      body: JSON.stringify(body)
    });

    const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();

    let type = "description";
    while (true) {
      const {value, done} = await reader.read();
      if (done){
        handleTextStream("Done");
        break;
      }

      const lines = value.split("\n").filter(line => line.trim() !== "");
      for (const line of lines) {
          const message = line.replace(/^data: /, "");
          
          if (message === "[END_DESC]") type = "title";
          handleTextStream(type, message, done);
      }
    }

    return "success";
  }

  async callPutAPI(authInfo, endpoint, body) {
    const params = {
      body,
      method: "PUT"
    };

    const url = API_URL + "/" + endpoint;
    const response = await this.callAPI(url, params, "json", false, authInfo);

    if (response.status === "failure") {
      response.data = `Problem putting ${endpoint}!`;
    }

    return response;
  };

  async callDeleteAPI(endpoint, query, authInfo) {
    const params = {
      method: "DELETE"
    };

    const queryStr = query ? Network.createQueryFromObj(query) : "";
    const url = API_URL + "/" + endpoint + "/" + queryStr;
    const response = await this.callAPI(url, params, "json", false, authInfo);

    if (response.status === "failure") {
      response.data = `Problem deleting ${endpoint}!`;
    }

    return response;
  };

}


export default Network;
