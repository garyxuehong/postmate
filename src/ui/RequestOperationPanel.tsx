import React, { useState, useEffect } from "react";
import {
  ApiRequest,
  ApiCert,
  RequestSendResponse,
  Variables
} from "../model/model";
import RequestPanel from "./RequestPanel";
import ResponsePanel from "./ResponsePanel";
import { Button } from "semantic-ui-react";
import sendRequest from "../request-sender/request-sender";
import variablesExtract from '../response-extractor/response-extractor';

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
  const [tempRequest, updateTempRequest] = useState<ApiRequest>(request);
  useEffect(() => {
    updateTempRequest(request);
  }, [request]);
  const [response, setResponse] = useState<RequestSendResponse | null>(null);
  return (
    <div>
      <h1>Request</h1>
      <div>
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
            primary
            onClick={async () => {
              setResponse(new RequestSendResponse());
              const resp = await sendRequest(tempRequest, variables, certs);
              const extractedVariables = variablesExtract(resp.body, request.variablesExtract);
              setResponse(resp);
              onExtractVariable(extractedVariables);
            }}
          >
            Send
          </Button>
        </p>
      </div>
      <h1>Response</h1>
      <div>
        <ResponsePanel response={response} />
      </div>
    </div>
  );
}
