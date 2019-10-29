import React from "react";
import { ApiRequest } from "../model/model";
import { Form } from "semantic-ui-react";

const RequestPanel: React.FC<{
  request: ApiRequest;
  onMethodChange: (value: string) => void;
  onUrlChange: (value: string) => void;
  onHeadersChange: (key: string, value: string) => void;
  onBodyChange: (value: string) => void;
}> = ({
  request,
  onMethodChange,
  onUrlChange,
  onHeadersChange,
  onBodyChange
}) => {
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
        <textarea
          value={request.body}
          onChange={e => onBodyChange(e.target.value)}
        />
      </Form.Field>
    </Form>
  );
};

export default RequestPanel;
