import Util from "common/services/util";
import request from "./axiosInstance";

export default {
    save(user) {
        return request({
            url: Util.apiUrl("/users"),
            data: user,
            method: "post"
        });
    },
    create() {},
    update() {},
    delete() {},
    getUsers() {
        return request.get(Util.apiUrl("/users"));
    },
    search() {}
};
