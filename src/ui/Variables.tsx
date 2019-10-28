import React from "react";

import { Dropdown } from "semantic-ui-react";

import { ApiEnvironment } from "../model/model";

const Variables: React.FC<{ environments: ApiEnvironment[] }> = ({
  environments
}) => {
  return (
    <div>
      <Dropdown text="environments">
        <Dropdown.Menu>
          {environments.map(env => (
            <Dropdown.Item key={env.name} text={env.name} />
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default Variables;
