import yaml from "js-yaml";
import path from "path";
import { ApiDoc } from "../model/model";

export default function loadApiYaml(
  apiLocation: string,
  content: string
): ApiDoc {
  const doc = (yaml.safeLoad(content) as any) as ApiDoc;
  doc.certs.forEach(cert => {
    if (cert.file && !cert.file.startsWith("/")) {
      cert.file = path.join(path.dirname(apiLocation), cert.file);
    }
  });
  return doc;
}
