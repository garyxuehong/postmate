export class Setting {
  apiDocLocation: string = "";
}

export class ApiDoc {
  name: string = "";
  environments: ApiEnvironment[] = [];
  collections: ApiCollection[] = [];
}

export class ApiEnvironment {
  name: string = "";
  variables: Variable[] = [];
}

export class Variable {
  key: string = "";
  value: string = "";
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
