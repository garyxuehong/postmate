import {
  ApiRequest,
  ApiCert,
  HttpRequest,
  Variables,
  Headers
} from "../model/model";

export default function parse(
  request: ApiRequest,
  variables: Variables,
  certs: ApiCert[]
): HttpRequest {
  const url = varReplace(request.url, variables);
  const isHttps = url.toLowerCase().startsWith("https");
  const cert = certs.find(cert => url.includes(cert.domain));
  let body = request.body || "";
  if (body !== "") {
    body = varReplace(body, variables);
  }
  let bodyBuffer = request.bodyBuffer;
  const method = varReplace(request.method, variables);
  const headers = varHeaderReplace(request.headers || {}, variables);
  return {
    isHttps,
    method,
    url,
    body,
    bodyBuffer,
    headers,
    cert
  };
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
    if (count++ > 10) break;
    for (const [key, value] of Object.entries(variables)) {
      newStr = replaceStrWithAll(newStr, key, value);
    }
  }
  newStr = replaceStrWithAll(newStr, '.+', '');
  return newStr;
}

function replaceStrWithAll(str: string, key: string, value: string) {
  const regex = new RegExp("\\${" + key + "}", "g");
  return str.replace(regex, value);
}
