import storage from "electron-json-storage";
import util from "util";

import { Setting } from "../model/model";

const storageGet = util.promisify(storage.get);
const storageSet = util.promisify(storage.set);


const LOCATION_KEY = "postmate-settings";

export async function get(): Promise<Setting> {
  return (storageGet(LOCATION_KEY) as any) as Setting;
}

export async function set(setting: Setting) {
  return storageSet(LOCATION_KEY, setting);
}
