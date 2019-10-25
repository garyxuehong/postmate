import yaml from "js-yaml";
import { ApiDoc } from "../model/model";
export default function loadApiYaml(content: string): ApiDoc {
  const doc = yaml.safeLoad(content);
  return doc;
}
