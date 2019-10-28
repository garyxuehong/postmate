import { promises as fs } from "fs";

import apiParser from "../api-parser/api-parser";

import { ApiDoc } from "../model/model";

export default async function loadLocation(
  apiLocation: string
): Promise<ApiDoc> {
  const content = await fs.readFile(apiLocation, "utf-8");
  return apiParser(apiLocation, content);
}
