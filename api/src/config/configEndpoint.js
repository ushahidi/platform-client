import * as UshahidiSdk from "ushahidi-platform-sdk/build/src/index";
import { getBackendUrl } from "./settings.js";

const backendUrl = getBackendUrl();
const ushahidi = new UshahidiSdk.Config(backendUrl);

export const getConfig = function (id = "") {
    return ushahidi.getConfig(id);
};
