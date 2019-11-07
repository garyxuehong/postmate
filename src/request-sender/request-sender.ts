import { HttpRequest, RequestSendResponse } from "../model/model";

import http from "http";
import https from "https";
import fs from "fs";

import util from "util";

const readFile = util.promisify(fs.readFile);

export default async function send(
  request: HttpRequest
): Promise<RequestSendResponse> {
  if (request.method.toUpperCase() === "BROWSER") {
    window.open(request.url);
    return new RequestSendResponse();
  }
  const certOption: { [index: string]: any } = {};
  if (request.isHttps && request.cert) {
    const certFileContent = await readFile(request.cert.file);
    certOption[request.cert.type] = certFileContent;
    certOption["passphrase"] = request.cert.passphrase;
  }
  return new Promise((resolve, reject) => {
    console.info(`Sending request to ${request.url}`);
    const option: { [index: string]: any } = {
      method: request.method,
      headers: {
        ...request.headers,
        'content-length': request.body.length //TODO deal with unicode
      },
      ...certOption
    };
    const newRequest = (request.isHttps ? https : http).request(
      request.url,
      option,
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
    );
    newRequest.on("error", e => {
      reject(e);
    });
    newRequest.write(request.body, err => {
      if (err) reject(err);
      newRequest.end();
    });
  });
}
