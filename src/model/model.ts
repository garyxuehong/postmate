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
  headers: { [index: string]: string } = {};
}

export class RequestSendResponse {
  statusCode: number = 0;
  headers: { [index: string]: string } = {};
  body: string = "";
}
