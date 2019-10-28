import React, { useState, useEffect } from "react";
import { Grid } from "semantic-ui-react";

import loadApiDoc from "../api-loader/api-loader";

import { ApiDoc, ApiRequest, Variable, ApiEnvironment } from "../model/model";

import ApiLocation from "./ApiLocation";
import RequestList from "./RequestList";
import RequestOperationPanel from "./RequestOperationPanel";
import Variables from "./Variables";

import { get as getSettings, set as setSettings } from "../settings/settings";

const Main: React.FC = () => {
  const [doc, setDoc] = useState<ApiDoc>(new ApiDoc());
  const [apiDocLocation, updateApiDocLocation] = useState("");
  const [activeRequest, setActiveRequest] = useState<ApiRequest>(
    new ApiRequest()
  );
  const [currVariables, updateCurrentVariables] = useState<Variable[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const setting = await getSettings();
        const newDoc = await loadApiDoc(setting.apiDocLocation);
        updateApiDocLocation(setting.apiDocLocation);
        setDoc(newDoc);
      } catch (e) {
        console.warn(e);
      }
    }
    load();
  }, []);

  function onPickEnv(env: ApiEnvironment) {
    const allVariables: Variable[] = [...currVariables, ...env.variables];
    const unique: Variable[] = [];
    for (const curr of allVariables) {
      if (unique.some(v => v.key === curr.key)) continue;
      unique.push(curr);
    }
    updateCurrentVariables(unique);
  }
  return (
    <Grid className="Main">
      <Grid.Row>
        <Grid.Column width={16}>
          <ApiLocation
            location={apiDocLocation}
            onSync={async (location: string) => {
              try {
                const doc = await loadApiDoc(location);
                await setSettings({ apiDocLocation: location });
                updateApiDocLocation(apiDocLocation);
                setDoc(doc);
              } catch (e) {
                console.warn(e);
              }
            }}
          />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width={4}>
          <RequestList doc={doc} onActivateRequest={setActiveRequest} />
        </Grid.Column>
        <Grid.Column width={8}>
          <RequestOperationPanel request={activeRequest} />
        </Grid.Column>
        <Grid.Column width={4}>
          <Variables
            currVariables={currVariables}
            environments={doc.environments}
            onPickEnv={onPickEnv}
          />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default Main;
