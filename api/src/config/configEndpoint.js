import * as UshahidiSdk from "ushahidi-platform-sdk/build/src/index";
import { getBackendUrl } from "./settings.js";

console.log('here configendpoint')
const backendUrl = getBackendUrl();
console.log(backendUrl)
const ushahidi = new UshahidiSdk.Config(backendUrl);

export const getConfig = function (id = "") {
    return ushahidi.getConfig(id);
};
