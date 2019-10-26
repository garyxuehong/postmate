import React from "react";
import { ApiRequest } from "../model/model";
import { Form } from "semantic-ui-react";

const RequestPanel: React.FC<{ request: ApiRequest | null }> = ({
  request
}) => {
  return (
    <Form>
      <Form.Field>
        <label>method</label>
        <input value={request === null ? "" : request.method} readOnly />
      </Form.Field>
      <Form.Field>
        <label>url</label>
        <input value={request === null ? "" : request.url} readOnly />
      </Form.Field>
      {(request === null ? [] : Object.entries(request.headers)).map(
        ([key, value]) => (
          <Form.Field key={key}>
            <label>{key}</label>
            <input value={value} readOnly />
          </Form.Field>
        )
      )}
    </Form>
  );
};

export default RequestPanel;
