import React, { useState } from "react";

import { ApiDoc, ApiRequest } from "../model/model";

import { Accordion, Icon, List } from "semantic-ui-react";

export default function RequestList({
  doc,
  onActivateRequest
}: {
  doc: ApiDoc;
  onActivateRequest: (request: ApiRequest) => void;
}) {
  const [activeIdx, setActiveIdx] = useState(0);
  return (
    <>
      <h1>{doc.name}</h1>
      <div id="requestList">
        <Accordion>
          {doc.collections.map((col, idx) => (
            <div key={col.name}>
              <Accordion.Title
                onClick={_ => {
                  setActiveIdx(idx);
                }}
              >
                <Icon name="dropdown" /> {col.name}
              </Accordion.Title>
              <Accordion.Content active={idx === activeIdx}>
                <List>
                  {col.requests.map(req => (
                    <List.Item
                      className="api-item"
                      key={req.name}
                      onClick={() => {
                        onActivateRequest(req);
                      }}
                    >
                      <Icon name="code" />
                      {req.name}
                    </List.Item>
                  ))}
                </List>
              </Accordion.Content>
            </div>
          ))}
        </Accordion>
      </div>
    </>
  );
}
