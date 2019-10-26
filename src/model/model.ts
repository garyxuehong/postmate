export class ApiDoc {
  name: string = "";
  author: string | null = null;
  collections: ApiCollection[] = [];
}

export class ApiCollection {
  name: string = "";
  requests: ApiRequest[] = [];
}

export class ApiRequest {
  name: string = "";
  method: "GET" | "POST" = "GET";
  url: string = "";
  headers: { key: string; value: string }[] = [];
}

export class RequestSendResponse {
  body: string = "";
}
