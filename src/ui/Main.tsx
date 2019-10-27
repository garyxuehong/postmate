import React, { useState, useEffect } from "react";
import { Grid } from "semantic-ui-react";

import loadApiDoc from "../api-loader/api-loader";

import { ApiDoc, ApiRequest } from "../model/model";

import ApiLocation from "./ApiLocation";
import RequestList from "./RequestList";
import RequestOperationPanel from "./RequestOperationPanel";

const DEMO_API = "/Users/xueg/source/fun/postmate/fixtures/api1.yaml";

const Main: React.FC = () => {
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
        <Grid.Column width={16}>
          <ApiLocation
            location={DEMO_API}
            onSync={async (location: string) => {
              const doc = await loadApiDoc(location);
              setDoc(doc);
            }}
          />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width={4}>
          <RequestList doc={doc} onActivateRequest={setActiveRequest} />
        </Grid.Column>
        <Grid.Column width={12}>
          <RequestOperationPanel request={activeRequest} />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default Main;
