import React, { useState } from "react";
import { ApiRequest, RequestSendResponse } from "../model/model";
import RequestPanel from "./RequestPanel";
import ResponsePanel from "./ResponsePanel";
import { Button } from "semantic-ui-react";
import sendRequest from "../request-sender/request-sender";

export default function RequestOperationPanel({
  request
}: {
  request: ApiRequest | null;
}) {
  const [response, setResponse] = useState<RequestSendResponse | null>(null);
  return (
    <div>
      <h1>
        Request
        <Button
          onClick={async () => {
            if (request === null) return;
            const resp = await sendRequest(request);
            setResponse(resp);
          }}
        >
          Send
        </Button>
      </h1>
      <div>
        <RequestPanel request={request} />
      </div>
      <h1>Response</h1>
      <div>
        <ResponsePanel response={response} />
      </div>
    </div>
  );
}
