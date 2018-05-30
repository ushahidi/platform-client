import Util from "common/services/util";
import request from "./axiosInstance";

export default {
    saveUser(user) {
        return request({
            url: Util.apiUrl("/users"),
            data: user,
            method: "post"
        });
    }
};
