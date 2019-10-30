import React, { useState, useEffect } from "react";
import { Form } from "semantic-ui-react";

export default function ApiLocation({
  location,
  onSync
}: {
  location: string | null;
  onSync: (location: string) => void;
}) {
  const [tempLocation, updateTempLocation] = useState(location);
  useEffect(() => {
    updateTempLocation(location);
  }, [location]);
  return (
    <Form>
      <Form.Group>
        <Form.Input
          width={14}
          placeholder="Yaml API Collections..."
          value={tempLocation || ""}
          onChange={e => {
            updateTempLocation(e.target.value);
          }}
        />
        <Form.Button
          className="btn-sync"
          color='black'
          width={2}
          onClick={async () => {
            if (tempLocation !== null) onSync(tempLocation);
          }}
        >
          Sync
        </Form.Button>
      </Form.Group>
    </Form>
  );
}
