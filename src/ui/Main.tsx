import React, { useState, useRef, useEffect } from "react";
import { Grid, Button, Accordion, List } from "semantic-ui-react";

import loadApiDoc from "../api-loader/api-loader";
import sendRequest from "../request-sender/request-sender";

import { ApiDoc, ApiRequest, RequestSendResponse } from "../model/model";

import RequestPanel from "./RequestPanel";
import ResponsePanel from "./ResponsePanel";

const DEMO_API = "/Users/xueg/source/fun/postmate/fixtures/api1.yaml";

const Main: React.FC = () => {
  const refInput = useRef(null);
  const [doc, setDoc] = useState<ApiDoc>(new ApiDoc());
  const [activeRequest, setActiveRequest] = useState<ApiRequest | null>(null);
  const [
    activeResponse,
    setActiveResponse
  ] = useState<RequestSendResponse | null>(null);
  useEffect(() => {
    async function load() {
      const newDoc = await loadApiDoc(DEMO_API);
      setDoc(newDoc);
    }
    load();
  }, []);
  return (
    <Grid className="Main">
      <Grid.Row>
        <Grid.Column width={16}>
          <input
            width={1200}
            ref={refInput}
            placeholder="Yaml API Collections..."
            value="/Users/xueg/source/fun/postmate/fixtures/api1.yaml"
            readOnly
          />
          <Button
            onClick={async () => {
              const input = refInput.current;
              const fileLocation = (input || { value: "" }).value;
              const newDoc = await loadApiDoc(fileLocation);
              setDoc(newDoc);
            }}
          >
            Sync
          </Button>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width={4}>
          <div>
            <h1>{doc.name}</h1>
          </div>
          <div>
            <Accordion>
              {doc.collections.map(col => (
                <div key={col.name}>
                  <Accordion.Title>{col.name}</Accordion.Title>
                  <Accordion.Content active={true}>
                    <List>
                      {col.requests.map(req => (
                        <List.Item
                          key={req.name}
                          onClick={() => {
                            setActiveRequest(req);
                          }}
                        >
                          {req.name}
                        </List.Item>
                      ))}
                    </List>
                  </Accordion.Content>
                </div>
              ))}
            </Accordion>
          </div>
        </Grid.Column>
        <Grid.Column width={12}>
          <div>main panel</div>
          <div>
            <Button
              onClick={async () => {
                if (activeRequest === null) return;
                const resp = await sendRequest(activeRequest);
                setActiveResponse(resp);
              }}
            >
              Send
            </Button>
          </div>
          <div>
            <RequestPanel request={activeRequest} />
          </div>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width={4}></Grid.Column>
        <Grid.Column width={12}>
          <h1>Response</h1>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width={4}></Grid.Column>
        <Grid.Column width={12}>
          <ResponsePanel response={activeResponse} />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <div>{JSON.stringify(doc, undefined, "\t")}</div>
      </Grid.Row>
    </Grid>
  );
};

export default Main;
