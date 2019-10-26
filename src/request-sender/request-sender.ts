import { ApiRequest, RequestSendResponse } from "../model/model";
import https from "https";

export default async function send(
  request: ApiRequest
): Promise<RequestSendResponse> {
  return new Promise((resolve, reject) => {
    https
      .get(request.url, resp => {
        let body = "";
        resp
          .on("data", d => {
            body += d;
          })
          .on("end", () => {
            const ret = new RequestSendResponse();
            ret.body = body;
            resolve(ret);
          });
      })
      .on("error", e => {
        reject(e);
      });
  });
}
