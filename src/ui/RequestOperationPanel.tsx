import React, { useState, useEffect, useRef } from "react";
import {
  ApiRequest,
  HttpRequest,
  ApiCert,
  RequestSendResponse,
  Variables
} from "../model/model";
import RequestPanel from "./RequestPanel";
import ResponsePanel from "./ResponsePanel";
import { Icon, Button, Segment, Label, Modal, Header } from "semantic-ui-react";
import sendRequest from "../request-sender/request-sender";
import variablesExtract from "../response-extractor/response-extractor";
import parseRequest from "../request-parser/request-parser";

const TEMP_CACHE_PASSPHRASE: { [index: string]: string } = {};

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
  const [isAskingForPassphrase, updateIsAskingForPassphrase] = useState(false);
  const passphraseRef = useRef(null);
  useEffect(() => {
    updateTempRequest(request);
    const resp = reqRespMap[request.name];
    setResponse(resp === undefined ? new RequestSendResponse() : resp);
    // eslint-disable-next-line
  }, [request]);
  async function fireRequest(httpRequest: HttpRequest) {
    try {
      updateIsSending(true);
      const resp = await sendRequest(httpRequest);
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
  }
  function cancelSend() {
    updateIsAskingForPassphrase(false);
  }
  async function confirmSend() {
    try {
      updateIsAskingForPassphrase(false);
      const httpRequest = parseRequest(tempRequest, variables, certs);
      const passphrase = ((passphraseRef.current as any) as HTMLInputElement)
        .value;
      if (httpRequest.cert) {
        TEMP_CACHE_PASSPHRASE[httpRequest.cert.domain] = passphrase;
        httpRequest.cert.passphrase = passphrase;
      }
      await fireRequest(httpRequest);
    } catch (_) {}
  }
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
            <Modal open={isAskingForPassphrase} onClose={cancelSend}>
              <Header icon="key" content="Passphrase" />
              <Modal.Content>
                <div>
                  <h3>Please enter your passphrase:</h3>
                  <input ref={passphraseRef} />
                </div>
              </Modal.Content>
              <Modal.Actions>
                <Button color="green" onClick={confirmSend}>
                  <Icon name="checkmark" /> Ok
                </Button>
              </Modal.Actions>
            </Modal>
            <Button
              color="green"
              loading={isSending}
              onClick={async () => {
                setResponse(new RequestSendResponse());
                const httpRequest = parseRequest(tempRequest, variables, certs);
                if (httpRequest.cert && !httpRequest.cert.passphrase) {
                  const cachedPassphrase =
                    TEMP_CACHE_PASSPHRASE[httpRequest.cert.domain];
                  if (cachedPassphrase) {
                    await fireRequest(httpRequest);
                  } else {
                    updateIsAskingForPassphrase(true);
                  }
                } else {
                  await fireRequest(httpRequest);
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
