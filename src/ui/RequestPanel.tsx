import React from "react";
import { ApiRequest } from "../model/model";
import { Form } from "semantic-ui-react";

import fs from 'fs';

const RequestPanel: React.FC<{
  request: ApiRequest;
  onMethodChange: (value: string) => void;
  onUrlChange: (value: string) => void;
  onHeadersChange: (key: string, value: string) => void;
  onBodyChange: (value: string ) => void;
  onBodyBufferChange: (value: Buffer) => void;
}> = ({
  request,
  onMethodChange,
  onUrlChange,
  onHeadersChange,
  onBodyChange,
  onBodyBufferChange
}) => {
  const headers = request.headers || {};
  const isFileUpload =
    (
      headers["content-type"] ||
      headers["Content-Type"] ||
      headers["CONTENT-TYPE"] ||
      ""
    ).toLowerCase() === "application/octet-stream";
  return (
    <Form>
      <Form.Field>
        <label>Method</label>
        <input
          value={request.method}
          onChange={e => onMethodChange(e.target.value)}
        />
      </Form.Field>
      <Form.Field>
        <label>Url</label>
        <input
          value={request.url}
          onChange={e => onUrlChange(e.target.value)}
        />
      </Form.Field>
      {Object.entries(request.headers || {}).map(([key, value]) => (
        <Form.Field key={key}>
          <label>{key}</label>
          <input
            value={value}
            onChange={e => onHeadersChange(key, e.target.value)}
          />
        </Form.Field>
      ))}
      <Form.Field>
        <label>Body</label>
        {isFileUpload ? (
          <input
            type="file"
            onChange={async e => {
              if (e.target.files && e.target.files.length > 0) {
                const file = e.target.files[0];
                if (file) {
                  const fileContent = await fs.promises.readFile(file.path);
                  onBodyBufferChange(fileContent);
                }
              }
            }}
          />
        ) : (
          <textarea
            value={request.body}
            onChange={e => onBodyChange(e.target.value)}
          />
        )}
      </Form.Field>
    </Form>
  );
};

export default RequestPanel;
