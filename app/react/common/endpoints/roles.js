import Util from "common/services/util";
import request from "./axiosInstance";

export default {
    getRoles() {
        // would like to remove util.apiUrl from here,
        // but can't do it yet because window.ushahid.backendUrl
        // is undefined when the axios instance is instantiated
        return request.get(Util.apiUrl("/roles"));
    }
};
