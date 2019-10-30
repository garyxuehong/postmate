import React from "react";

import { Dropdown, Form, Segment, Label } from "semantic-ui-react";

import { ApiEnvironment, Variables } from "../model/model";

const VariablesPanel: React.FC<{
  environments: ApiEnvironment[];
  currVariables: Variables;
  onPickEnv: (env: ApiEnvironment) => void;
}> = ({ environments, currVariables, onPickEnv }) => {
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
            <label>{key}</label>
            <input value={currVariables[key]} readOnly />
          </Form.Field>
        ))}
      </Form>
    </Segment>
  );
};

export default VariablesPanel;
