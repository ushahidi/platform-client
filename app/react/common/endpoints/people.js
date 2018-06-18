import Util from "common/services/util";
import request from "./axiosInstance";

export default {
    save(person) {
        return request({
            url: Util.apiUrl("/users"),
            data: person,
            method: "post"
        });
    },
    create(person) {},
    update(person, id) {
        return request({
            url: Util.apiUrl("/users"),
            data: person,
            method: "put",
            params: {
                id
            }
        });
    },
    delete(person) {},
    get(id) {
        return request({
            url: Util.apiUrl("/users"),
            method: "get",
            params: {
                id
            }
        });
    },
    search() {}
};
