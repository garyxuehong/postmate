import React, { useState, useRef, useEffect } from "react";
import { Grid, Button, Accordion, List } from "semantic-ui-react";

import loadApiDoc from "../api-loader/api-loader";

import { ApiDoc, ApiRequest } from "../model/model";

const DEMO_API = "/Users/xueg/source/fun/postmate/fixtures/api1.yaml";

const Main: React.FC = () => {
  const refInput = useRef(null);
  const [doc, setDoc] = useState<ApiDoc>(new ApiDoc());
  const [activeRequest, setActiveRequest] = useState<ApiRequest | null>(null);
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
        <input
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
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width={4}>
          <div>
            <h1>{doc.name}</h1>
          </div>
          <div>
            <Accordion>
              {doc.collections.map(col => (
                <>
                  <Accordion.Title>{col.name}</Accordion.Title>
                  <Accordion.Content active={true}>
                    <List>
                      {col.requests.map(req => (
                        <List.Item
                          description={req.url}
                          onClick={() => {
                            setActiveRequest(req);
                          }}
                        >
                          {req.name}
                        </List.Item>
                      ))}
                    </List>
                  </Accordion.Content>
                </>
              ))}
            </Accordion>
          </div>
        </Grid.Column>
        <Grid.Column width={8}>
          <div>main panel</div>
          <div>{JSON.stringify(activeRequest)}</div>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row></Grid.Row>
      <Grid.Row>
        <pre>{JSON.stringify(doc, undefined, "\t")}</pre>
      </Grid.Row>
    </Grid>
  );
};

export default Main;
