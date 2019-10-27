import React, { useRef } from "react";
import { Button } from "semantic-ui-react";

export default function ApiLocation({
  onSync
}: {
  onSync: (location: string) => void;
}) {
  const refInput = useRef(null);
  return (
    <div>
      <input
        width={1200}
        ref={refInput}
        placeholder="Yaml API Collections..."
        readOnly
      />
      <Button
        onClick={async () => {
          const input = refInput.current;
          const fileLocation = (input || { value: "" }).value;
          onSync(fileLocation);
        }}
      >
        Sync
      </Button>
    </div>
  );
}
