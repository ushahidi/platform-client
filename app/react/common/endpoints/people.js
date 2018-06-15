import Util from "common/services/util";
import request from "./axiosInstance";

export default {
    savePerson(person) {
        return request({
            url: Util.apiUrl("/users"),
            data: person,
            method: "post"
        });
    },
    fetchPeople(query = {}) {
        const params = { orderby: "realname" };
        Object.assign(params, query);
        return request({
            url: Util.apiUrl("/users"),
            method: "get",
            params
        });
    }
};
