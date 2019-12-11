import React from "react";
import { RequestSendResponse } from "../model/model";
import { Form } from "semantic-ui-react";

const ResponsePanel: React.FC<{ response: RequestSendResponse | null }> = ({
  response
}) => {
  let body = response === null ? "" : response.body;
  try {
    body = JSON.stringify(JSON.parse(body), undefined, "  ");
  } catch (_) {}
  return (
    <Form>
      <Form.Field>
        <label>Status</label>
        <input value={response === null ? "" : response.statusCode} readOnly />
      </Form.Field>
      <Form.Field>
        <label>Headers</label>
        <textarea
          value={
            response === null
              ? ""
              : JSON.stringify(response.headers, undefined, "  ")
          }
          readOnly
        />
      </Form.Field>
      <Form.Field>
        <label>Body</label>
        <textarea value={body} readOnly rows={50} />
      </Form.Field>
    </Form>
  );
};

export default ResponsePanel;
