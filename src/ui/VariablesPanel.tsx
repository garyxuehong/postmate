import React, { useState, useEffect } from 'react';

import { Dropdown, Form, Segment, Label } from "semantic-ui-react";

import { ApiEnvironment, Variables } from "../model/model";

const VariablesPanel: React.FC<{
  environments: ApiEnvironment[];
  currVariables: Variables;
  variablesOrigin: { [index: string]: string };
  onPickEnv: (env: ApiEnvironment) => void;
  isMockServerRuning: boolean;
  onStartMockServer: () => void;
  onStopMockServer: () => void;
  onUpdateVariables: (newVar: Variables) => void;
}> = ({
  environments,
  currVariables,
  variablesOrigin,
  isMockServerRuning,
  onPickEnv,
  onStartMockServer,
  onStopMockServer,
  onUpdateVariables
}) => {
  const [selectedEnv, setSelectedEnv] = useState(environments.length > 0 ? environments[0].name : '');
  useEffect(() => {
    if (environments.length > 0) {
      setSelectedEnv(environments[0].name);
    }
  }, [environments]);
  return (
    <Segment raised>
      <Label color="blue" ribbon>
        Environments
      </Label>
      <Dropdown text="select" value={selectedEnv} className="envDropdown">
        <Dropdown.Menu>
          {environments.map(env => (
            <Dropdown.Item
              key={env.name}
              className={`${
                env.name.toLowerCase().indexOf("prod") !== -1 ? "font-red" : ""
              }`}
              text={env.name}
              onClick={() => {
                onPickEnv(env);
                setSelectedEnv(env.name);
              }}
            />
          ))}
        </Dropdown.Menu>
      </Dropdown>
      {!isMockServerRuning ? (
        // eslint-disable-next-line
        <a className="startMockServer" onClick={onStartMockServer}>
          Start a mock server at 8443
        </a>
      ) : (
        // eslint-disable-next-line
        <a className="stopMockServer" onClick={onStopMockServer}>
          Stop a mock server
        </a>
      )}
      <Form className="variablesPanel">
        {Object.keys(currVariables).map(key =>
          !currVariables[key] ? null : (
            <Form.Field key={key}>
              <label>
                {key} (
                <span
                  className={`${
                    (variablesOrigin[key] || "")
                      .toLowerCase()
                      .indexOf("prod") !== -1
                      ? "font-red"
                      : ""
                  }`}
                >
                  {variablesOrigin[key]}
                </span>
                )
              </label>
              <input
                value={currVariables[key]}
                onChange={e => {
                  const newVar: Variables = {};
                  newVar[key] = e.currentTarget.value;
                  onUpdateVariables(newVar);
                }}
              />
            </Form.Field>
          )
        )}
      </Form>
    </Segment>
  );
};

export default VariablesPanel;
