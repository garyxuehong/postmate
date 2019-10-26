import { ApiRequest, RequestSendResponse } from "../model/model";
import https from "https";

export default async function send(
  request: ApiRequest
): Promise<RequestSendResponse> {
  return new Promise((resolve, reject) => {
    https
      .request(
        request.url,
        {
          method: "get",
          headers: request.headers
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
