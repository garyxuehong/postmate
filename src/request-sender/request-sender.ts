import {
  ApiRequest,
  RequestSendResponse,
  Variables,
  Headers
} from "../model/model";

import http from "http";
import https from "https";

export default async function send(
  request: ApiRequest,
  variables: Variables
): Promise<RequestSendResponse> {
  const isHttps = request.url.toLowerCase().startsWith("https");
  return new Promise((resolve, reject) => {
    const url = varReplace(request.url, variables);
    console.info(`Sending request to ${url}`);
    (isHttps ? https : http)
      .request(
        url,
        {
          method: varReplace(request.method, variables),
          headers: varHeaderReplace(request.headers, variables)
        },
        resp => {
          let body = "";
          resp
            .on("data", d => {
              body += d;
            })
            .on("end", () => {
              const ret = new RequestSendResponse();
              ret.statusCode = resp.statusCode || 0;
              ret.headers = (resp.headers as any) as {
                [index: string]: string;
              };
              ret.body = body;
              resolve(ret);
            });
        }
      )
      .on("error", e => {
        reject(e);
      })
      .end();
  });
}

function varReplace(str: string, variables: Variables): string {
  return replaceStrWithVariables(str, variables);
}

function varHeaderReplace(headers: Headers, variables: Variables): Headers {
  const ret: Headers = {};
  for (const key of Object.keys(headers)) {
    ret[key] = replaceStrWithVariables(headers[key], variables);
  }
  return ret;
}

function replaceStrWithVariables(str: string, variables: Variables) {
  let newStr = str;
  let count = 0;
  while (newStr.includes("${")) {
    if (count++ > 1000) break;
    for (const [key, value] of Object.entries(variables)) {
      newStr = replaceStrWithAll(newStr, key, value);
    }
  }
  return newStr;
}

function replaceStrWithAll(str: string, key: string, value: string) {
  const regex = new RegExp("\\${" + key + "}", "g");
  return str.replace(regex, value);
}
