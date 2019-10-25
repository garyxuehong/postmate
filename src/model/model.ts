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
  url: string = "";
}

export class RequestSendResponse {
  body: string = "";
}
