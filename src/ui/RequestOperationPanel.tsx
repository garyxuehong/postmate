import React, { useState, useEffect } from "react";
import {
  ApiRequest,
  ApiCert,
  RequestSendResponse,
  Variables
} from "../model/model";
import RequestPanel from "./RequestPanel";
import ResponsePanel from "./ResponsePanel";
import { Icon, Button, Segment, Label } from "semantic-ui-react";
import sendRequest from "../request-sender/request-sender";
import variablesExtract from "../response-extractor/response-extractor";

export default function RequestOperationPanel({
  request,
  certs,
  variables,
  onExtractVariable
}: {
  request: ApiRequest;
  certs: ApiCert[];
  variables: Variables;
  onExtractVariable: (variables: Variables) => void;
}) {
  const [reqRespMap, updateReqRespMap] = useState<{
    [index: string]: RequestSendResponse;
  }>({});
  const [tempRequest, updateTempRequest] = useState<ApiRequest>(request);
  const [response, setResponse] = useState<RequestSendResponse | null>(null);
  const [isSending, updateIsSending] = useState(false);
  useEffect(() => {
    updateTempRequest(request);
    const resp = reqRespMap[request.name];
    setResponse(resp === undefined ? new RequestSendResponse() : resp);
    // eslint-disable-next-line
  }, [request]);
  return (
    <div>
      <Segment raised>
        <Label color="blue" ribbon>
          Request
        </Label>
        {request.name && <span className="activeApiName">{request.name}</span>}
        <div className="requestPanel">
          <RequestPanel
            request={tempRequest}
            onMethodChange={method => {
              updateTempRequest({ ...tempRequest, method });
            }}
            onUrlChange={url => {
              updateTempRequest({ ...tempRequest, url });
            }}
            onHeadersChange={(key, value) => {
              updateTempRequest({
                ...tempRequest,
                headers: { ...tempRequest.headers, ...{ [key]: value } }
              });
            }}
            onBodyChange={body => {
              updateTempRequest({ ...tempRequest, body });
            }}
          />
          <p>
            <br />
            <Button
              color="green"
              loading={isSending}
              onClick={async () => {
                try {
                  updateIsSending(true);
                  setResponse(new RequestSendResponse());
                  const resp = await sendRequest(tempRequest, variables, certs);
                  const extractedVariables = variablesExtract(
                    resp.body,
                    request.variablesExtract
                  );
                  setResponse(resp);
                  const newReqMap = { ...reqRespMap };
                  newReqMap[tempRequest.name] = resp;
                  updateReqRespMap(newReqMap);
                  onExtractVariable(extractedVariables);
                } catch (e) {
                  console.error(e);
                  alert(e);
                } finally {
                  updateIsSending(false);
                }
              }}
            >
              <Icon name="send" />
              Send
            </Button>
          </p>
        </div>
      </Segment>
      <Segment raised>
        <Label color="blue" ribbon>
          Response
        </Label>
        <div className="responsePanel">
          <ResponsePanel response={response} />
        </div>
      </Segment>
    </div>
  );
}
