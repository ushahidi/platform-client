import * as UshahidiSdk from "ushahidi-platform-sdk/build/src/index";
import { getBackendUrl } from "@ushahidi/utilities";

const backendUrl = getBackendUrl();
const ushahidi = new UshahidiSdk.Config(backendUrl);

export const getConfig = function (id = "") {
    return ushahidi.getConfig(id);
};
