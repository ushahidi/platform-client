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
    create(/** person * */) {},
    update(/** person * */) {},
    delete(/** person * */) {},
    get(person) {
        return request({
            url: Util.apiUrl(`/users/${person.id}`),
            method: "get"
        });
    },
    search(params) {
        const query = Object.assign(params, {});
        return request({
            url: Util.apiUrl("/users"),
            method: "get",
            query
        });
    }
};
