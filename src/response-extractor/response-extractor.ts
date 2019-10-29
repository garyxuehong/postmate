import { Variables, VariablesExtract } from "../model/model";
import _ from "lodash";

export default function extractVariables(
  body: string,
  variablesExtract: VariablesExtract
): Variables {
  const ret: Variables = {};
  try {
    const data = JSON.parse(body);
    if (data !== undefined) {
      for (const key of Object.keys(variablesExtract)) {
        const val = _.get(data, variablesExtract[key]);
        if (val !== undefined) {
          ret[key] = val;
        }
      }
    }
  } catch (_) {}
  return ret;
}
