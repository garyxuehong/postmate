import { ApiRequest, RequestSendResponse } from "../model/model";

export default async function send(
  request: ApiRequest
): Promise<RequestSendResponse> {
  const ret = new RequestSendResponse();
  ret.body = "blah";
  return ret;
}
