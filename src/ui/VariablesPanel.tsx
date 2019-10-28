import React from "react";

import { Dropdown, Form } from "semantic-ui-react";

import { ApiEnvironment, Variables } from "../model/model";

const VariablesPanel: React.FC<{
  environments: ApiEnvironment[];
  currVariables: Variables;
  onPickEnv: (env: ApiEnvironment) => void;
}> = ({ environments, currVariables, onPickEnv }) => {
  return (
    <div>
      <div>
        <Dropdown text="environments">
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
      </div>
      <Form>
        {Object.keys(currVariables).map(key => (
          <Form.Field key={key}>
            <label>{key}</label>
            <input value={currVariables[key]} readOnly />
          </Form.Field>
        ))}
      </Form>
    </div>
  );
};

export default VariablesPanel;
