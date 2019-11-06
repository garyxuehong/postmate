import React from "react";

import { Dropdown, Form, Segment, Label } from "semantic-ui-react";

import { ApiEnvironment, Variables } from "../model/model";

const VariablesPanel: React.FC<{
  environments: ApiEnvironment[];
  currVariables: Variables;
  variablesOrigin: { [index: string]: string };
  onPickEnv: (env: ApiEnvironment) => void;
}> = ({ environments, currVariables, variablesOrigin, onPickEnv }) => {
  return (
    <Segment raised>
      <Label color="blue" ribbon>
        Environments
      </Label>
      <Dropdown text="select" className="envDropdown">
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
              }}
            />
          ))}
        </Dropdown.Menu>
      </Dropdown>
      <Form className="variablesPanel">
        {Object.keys(currVariables).map(key => (
          <Form.Field key={key}>
            <label
              className={`${
                (variablesOrigin[key] || "").toLowerCase().indexOf("prod") !==
                -1
                  ? "font-red"
                  : ""
              }`}
            >
              {key}
            </label>
            <input value={currVariables[key]} readOnly />
          </Form.Field>
        ))}
      </Form>
    </Segment>
  );
};

export default VariablesPanel;
