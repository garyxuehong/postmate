import React from "react";

import { ApiDoc, ApiRequest } from "../model/model";

import { Accordion, List } from "semantic-ui-react";

export default function RequestList({
  doc,
  onActivateRequest
}: {
  doc: ApiDoc;
  onActivateRequest: (request: ApiRequest) => void;
}) {
  return (
    <>
      <h1>{doc.name}</h1>
      <div>
        <Accordion>
          {doc.collections.map(col => (
            <div key={col.name}>
              <Accordion.Title>{col.name}</Accordion.Title>
              <Accordion.Content active={true}>
                <List>
                  {col.requests.map(req => (
                    <List.Item
                      key={req.name}
                      onClick={() => {
                        onActivateRequest(req);
                      }}
                    >
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
