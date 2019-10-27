import React from "react";
import { RequestSendResponse } from "../model/model";
import { Form } from "semantic-ui-react";

const ResponsePanel: React.FC<{ response: RequestSendResponse | null }> = ({
  response
}) => {
  return (
    <Form>
      <Form.Field>
        <label>Status</label>
        <input value={response === null ? "" : response.statusCode} readOnly />
      </Form.Field>
      <Form.Field>
        <label>Headers</label>
        <textarea
          value={response === null ? "" : JSON.stringify(response.headers)}
          readOnly
        />
      </Form.Field>
      <Form.Field>
        <label>Body</label>
        <textarea value={response === null ? "" : response.body} readOnly />
      </Form.Field>
    </Form>
  );
};

export default ResponsePanel;
