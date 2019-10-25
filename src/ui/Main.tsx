import React, { useState, useRef } from "react";
import { Grid, Button } from "semantic-ui-react";

import loadApiDoc from "../api-loader/api-loader";

import { ApiDoc } from "../model/model";

const Main: React.FC = () => {
  const refInput = useRef(null);
  const [doc, setDoc] = useState<ApiDoc | null>(null);
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
            console.log(input);
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
          <div>hello</div>
        </Grid.Column>
        <Grid.Column width={8}>
          <div>main panel</div>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <pre>{JSON.stringify(doc, undefined, "\t")}</pre>
      </Grid.Row>
    </Grid>
  );
};

export default Main;
