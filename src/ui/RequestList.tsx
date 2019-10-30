import React, { useState } from "react";

import { ApiDoc, ApiRequest } from "../model/model";

import {
  Segment,
  Accordion,
  Icon,
  List,
  Header,
  Label
} from "semantic-ui-react";

function getColor(method: string) {
  if (!method) {
    return "grey";
  }
  method = method.toUpperCase();
  if (method === "GET") return "green";
  if (method === "POST") return "orange";
  if (method === "PUT") return "orange";
  if (method === "PATCH") return "orange";
  if (method === "DELETE") return "red";
  if (method === "BROWSER") return "blue";
  return "grey";
}

export default function RequestList({
  doc,
  onActivateRequest
}: {
  doc: ApiDoc;
  onActivateRequest: (request: ApiRequest) => void;
}) {
  const [activeIdxMap, setActiveIdxMap] = useState<{
    [index: number]: boolean | undefined;
  }>({});
  const [lastClicked, updateLastClicked] = useState<string>("");
  return (
    <Segment raised>
      <Label color="blue" ribbon>
        {doc.name}
      </Label>
      <div id="requestList">
        <Accordion>
          {doc.collections.map((col, idx: number) => {
            const active = activeIdxMap[idx] !== false;
            return (
              <div key={col.name}>
                <Accordion.Title
                  className="apiRequestGroup"
                  onClick={_ => {
                    const newIdxMap: {
                      [index: number]: boolean | undefined;
                    } = {
                      ...activeIdxMap
                    };
                    newIdxMap[idx] = !active;
                    setActiveIdxMap(newIdxMap);
                  }}
                >
                  <Header size="medium">
                    <Icon name="dropdown" /> {col.name}
                  </Header>
                </Accordion.Title>
                <Accordion.Content active={active}>
                  <List>
                    {col.requests.map(req => (
                      <List.Item
                        className={`api-item ${
                          lastClicked === req.name ? "active" : ""
                        }`}
                        key={req.name}
                        onClick={() => {
                          updateLastClicked(req.name);
                          onActivateRequest(req);
                        }}
                      >
                        {req.name}
                        <Label
                          className="requestLabel"
                          color={getColor(req.method)}
                          horizontal
                          basic
                        >
                          {req.method}
                        </Label>
                      </List.Item>
                    ))}
                  </List>
                </Accordion.Content>
              </div>
            );
          })}
        </Accordion>
      </div>
    </Segment>
  );
}
