import {
  ApiRequest,
  ApiCert,
  RequestSendResponse,
  Variables,
  Headers
} from "../model/model";

import http from "http";
import https from "https";
import fs from "fs";

import util from "util";
const readFile = util.promisify(fs.readFile);

export default async function send(
  request: ApiRequest,
  variables: Variables,
  certs: ApiCert[]
): Promise<RequestSendResponse> {
  const url = varReplace(request.url, variables);
  if (request.method.toUpperCase() === "BROWSER") {
    window.open(url);
    return new RequestSendResponse();
  }
  const isHttps = url.toLowerCase().startsWith("https");
  const cert = certs.find(cert => url.includes(cert.domain));
  const certOption: { [index: string]: any } = {};
  if (isHttps && cert) {
    const certFileContent = await readFile(cert.file);
    certOption[cert.type] = certFileContent;
    certOption["passphrase"] = cert.passphrase;
  }
  let requestBody = request.body || "";
  if (requestBody !== "") {
    requestBody = varReplace(requestBody, variables);
  }
  return new Promise((resolve, reject) => {
    console.info(`Sending request to ${url}`);
    const option: { [index: string]: any } = {
      method: varReplace(request.method, variables),
      headers: varHeaderReplace(request.headers, variables),
      ...certOption
    };
    const newRequest = (isHttps ? https : http).request(url, option, resp => {
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
    });
    newRequest.on("error", e => {
      reject(e);
    });
    newRequest.write(requestBody, err => {
      if (err) reject(err);
      newRequest.end();
    });
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
