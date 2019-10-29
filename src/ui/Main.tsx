import { ipcRenderer } from "electron";
import React, { useState, useEffect } from "react";
import { Grid } from "semantic-ui-react";

import loadApiDoc from "../api-loader/api-loader";

import { ApiDoc, ApiRequest, Variables, ApiEnvironment } from "../model/model";

import ApiLocation from "./ApiLocation";
import RequestList from "./RequestList";
import RequestOperationPanel from "./RequestOperationPanel";
import VariablesPanel from "./VariablesPanel";

import { get as getSettings, set as setSettings } from "../settings/settings";

const Main: React.FC = () => {
  const [doc, setDoc] = useState<ApiDoc>(new ApiDoc());
  const [apiDocLocation, updateApiDocLocation] = useState("");
  const [activeRequest, setActiveRequest] = useState<ApiRequest>(
    new ApiRequest()
  );
  const [currVariables, updateCurrentVariables] = useState<Variables>({});

  useEffect(() => {
    async function messagesWithMain() {
      ipcRenderer.on("newVariables", (_, msg) => {
        const vars: Variables = msg;
        const allVariables: Variables = { ...currVariables, ...vars };
        updateCurrentVariables(allVariables);
      });
    }
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
    messagesWithMain();
    load();
  }, []);

  function onPickEnv(env: ApiEnvironment) {
    const allVariables: Variables = { ...currVariables, ...env.variables };
    updateCurrentVariables(allVariables);
  }

  function onExtractVariable(vars: Variables) {
    const allVariables: Variables = { ...currVariables, ...vars };
    updateCurrentVariables(allVariables);
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
          <RequestOperationPanel
            request={activeRequest}
            variables={currVariables}
            certs={doc.certs}
            onExtractVariable={onExtractVariable}
          />
        </Grid.Column>
        <Grid.Column width={4}>
          <VariablesPanel
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
