import React, { useState } from "react";
import { Form } from "semantic-ui-react";

export default function ApiLocation({
  location,
  onSync
}: {
  location: string;
  onSync: (location: string) => void;
}) {
  const [tempLocation, updateTempLocation] = useState(location);
  return (
    <Form>
      <Form.Group>
        <Form.Input
          width={14}
          placeholder="Yaml API Collections..."
          value={tempLocation}
          onChange={e => {
            updateTempLocation(e.target.value);
          }}
        />
        <Form.Button
          className="btn-sync"
          secondary
          width={2}
          onClick={async () => {
            onSync(tempLocation);
          }}
        >
          Sync
        </Form.Button>
      </Form.Group>
    </Form>
  );
}
