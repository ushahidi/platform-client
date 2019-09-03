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
            url: Util.apiUrl(`/users/${id}`),
            data: person,
            method: "put"
        });
    },
    delete(person) {},
    get(id) {
        return request({
            url: Util.apiUrl(`/users/${id}`),
            method: "get"
        });
    },
    search() {
        return request({
            url: Util.apiUrl(`/users`),
            method: "get"
        });
    }
};
