import React, { useState, useEffect } from "react";
import { Form, Modal } from "semantic-ui-react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";

export default function ApiLocation({
  location,
  onSync
}: {
  location: string | null;
  onSync: (location: string) => void;
}) {
  const openSample = () => {};
  const [tempLocation, updateTempLocation] = useState(location);
  useEffect(() => {
    updateTempLocation(location);
  }, [location]);
  return (
    <Form>
      <Modal
        closeIcon
        trigger={
          // eslint-disable-next-line
          <a className="linkOpenSample" onClick={openSample}>
            Example API Yaml
          </a>
        }
      >
        <Modal.Header>Example API Yaml</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <SyntaxHighlighter language="yaml" style={docco}>
              {getSampleYaml()}
            </SyntaxHighlighter>
          </Modal.Description>
        </Modal.Content>
      </Modal>
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
          color="black"
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

function getSampleYaml() {
  return `
name: My API
certs:
  - domain: api.mycompany.com
    type: pfx
    file: ../certs/prod.p12
    passphrase: 12345
environments:
  - name: stage
    variables:
      website_hostname: https://www.stage.mycompany.com
      api_hostname: https://\${apiId}.api.mycompany.com
      user_number: 1234
      apiKey: xxx-xxx-xx
collections:
  - name: Api Collections Hello World
    requests:
      - name: Api1 (Must be unique name)
        method: GET
        url: |
          \${api_hostname}/api1?userNumber=\${user_number}
        headers:
          content-type: application/json
          api-key: \${apiKey}
      - name: Api2 (Must be unique name)
        method: POST
        url: |
          \${api_hostname}/api2?userNumber=\${user_number}
        headers:
          content-type: application/json
          api-key: \${apiKey}
  - name: Another Collection
    requests:
      - name: Create a post
        method: POST
        url: |
          \${api_hostname}/post?userNumber=\${user_number}
        headers:
          content-type: application/json
          api-key: \${apiKey}
        body: |
          {"post":"blah blah"}
        variablesExtract:
          postId: "postId"
      - name: View post in browser
        method: BROWSER
        url: |
          \${website_hostname}/post/\${postId}
        headers:
      - name: Delete a post
        method: DELETE
        url: |
          \${api_hostname}/post/\${postId}?userNumber=\${user_number}
        headers:
          content-type: application/json
          api-key: \${apiKey}
          `;
}
