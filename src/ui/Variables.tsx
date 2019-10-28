import React from "react";

import { Dropdown, Form } from "semantic-ui-react";

import { ApiEnvironment, Variable } from "../model/model";

const Variables: React.FC<{
  environments: ApiEnvironment[];
  currVariables: Variable[];
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
        {currVariables.map(variable => (
          <Form.Field key={variable.key}>
            <label>{variable.key}</label>
            <input value={variable.value} readOnly />
          </Form.Field>
        ))}
      </Form>
    </div>
  );
};

export default Variables;
