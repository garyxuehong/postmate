import React, { useState, useRef, useEffect } from "react";
import { ApiDoc, ApiRequest, RequestSendResponse } from "../model/model";
import { Form } from "semantic-ui-react";

const RequestPanel: React.FC<{ request: ApiRequest | null }> = ({
  request
}) => {
  return (
    <Form>
      <Form.Field>
        <label>method</label>
        <input value={request === null ? "" : request.method} />
      </Form.Field>
      <Form.Field>
        <label>url</label>
        <input value={request === null ? "" : request.url} />
      </Form.Field>
    </Form>
  );
};

export default RequestPanel;
