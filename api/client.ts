import axios from "axios";
import {AsyncStorage} from "react-native";
import Constants from "expo-constants";

// hold the environment data, such as the api end point
const environment = {
  api: Constants.manifest.extra && Constants.manifest.extra.apiEndpoint ? Constants.manifest.extra.apiEndpoint : "https://dev.api.pregxas.com",
};

/**
 * This is the primary method to make an async request and returns a promise
 * @param method the HTTP method, such as GET, POST, PATCH, PUT, or DELETE
 * @param endpoint the resource which is appended to the end of the environment.api string
 * @param data either the query string or request body parameters
 * @param options configuration options for the request, such as headers and secrets 
 */
export async function makeCall(method: string, endpoint: string, data: any = {}, options: any = {}): Promise<any> {
  const url = makeUrl(endpoint);

  if(data && !data.count){
    data.count = 10000;
  }

  const meth = method.toLowerCase();
  const config: any = {
    method: meth,
    url,
    timeout: 15000,
    headers: {
      jwt: ""
    },
    params: {},
    data: {},
  };

  let jwt: string | null = "";
  try{
    jwt = await AsyncStorage.getItem("jwt")
    if(jwt !== null){
      config.headers.jwt = jwt;
    }
  }catch(err){
    // just swallow the error
  }

  
  if(options.asMultipartFile){
    const formData = new FormData();
    formData.append("file", data);
    config.data = formData;
  } else {
    if (meth === "get" || meth === "delete") {
      config.params = data;
    } else {
      config.data = data;
    }
  }

  if(options.accept){
    config.headers.Accept = options.accept;
  }

  if(options.etag){
    config.headers["If-None-Match"] = options.etag;
  }

  if(options.asDownload){
    config.responseType = "blob";
  }

  if(options.apiSecret){
    config.headers["X-API-SECRET"] = options.apiSecret;
  }

  return axios(config)
  .then((res) => {
    return Promise.resolve({
      code: 200,
      body: res.data
    });
  })
  .catch((err) => {
    const ret = {
      code: 500,
      body: err
    };

    if(err.response && err.response.status) {
      ret.code = err.response.status;
      ret.body = err.response.data;
    }

    // we need to check for expired token here
    if(ret.code === 419 || ret.body.error === "Expired"){
      // should probably trigger a logout and redirect them?
    }
    return Promise.reject(ret);
  });
}

/**
 * A helper function to generate a url, useful for building external resource links
 * @param endpoint 
 */
export function makeUrl(endpoint: string): string {
  // normalize
  let api = environment.api;
  if(api.charAt(api.length -1) === "/"){
    api = api.substr(0, api.length - 1);
  }
  let resource = endpoint;
  if(resource.charAt(resource.length -1) === "/"){
    resource = resource.substr(0, resource.length - 1);
  }
  if(resource.charAt(0) === "/"){
    resource = resource.substr(1, resource.length);
  }
  return `${api}/${resource}`;
}