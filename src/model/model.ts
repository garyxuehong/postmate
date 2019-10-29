export class Setting {
  apiDocLocation: string = "";
}

export class ApiDoc {
  name: string = "";
  certs: ApiCert[] = [];
  environments: ApiEnvironment[] = [];
  collections: ApiCollection[] = [];
}

export class ApiCert {
  domain: string = "";
  type: string = "pfx";
  file: string = "";
  passphrase: string = "";
}

export class ApiEnvironment {
  name: string = "";
  variables: Variables = {};
}

export class Variables {
  [index: string]: string;
}

export class ApiCollection {
  name: string = "";
  requests: ApiRequest[] = [];
}

export class Headers {
  [index: string]: string;
}

export class ApiRequest {
  name: string = "";
  method: string = "GET";
  url: string = "";
  headers: Headers = {};
  body: string = "";
  variablesExtract: VariablesExtract = {};
}

export class VariablesExtract {
  [index: string]: string;
}

export class RequestSendResponse {
  statusCode: number = 0;
  headers: Headers = {};
  body: string = "";
}
