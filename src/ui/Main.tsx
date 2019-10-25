import React from "react";
import { Grid, Input, Button } from "semantic-ui-react";

const Main: React.FC = () => {
  return (
    <Grid className="Main">
      <Grid.Row>
        <Input placeholder="Yaml API Collections..." />
        <Button>Sync</Button>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width={4}>
          <div>hello</div>
        </Grid.Column>
        <Grid.Column width={8}>
          <div>main panel</div>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default Main;
