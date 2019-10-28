export class Setting {
  apiDocLocation: string = "";
}

export class ApiDoc {
  name: string = "";
  collections: ApiCollection[] = [];
}

export class ApiCollection {
  name: string = "";
  requests: ApiRequest[] = [];
}

export class ApiRequest {
  name: string = "";
  method: string = "GET";
  url: string = "";
  headers: { [index: string]: string } = {};
}

export class RequestSendResponse {
  statusCode: number = 0;
  headers: { [index: string]: string } = {};
  body: string = "";
}
