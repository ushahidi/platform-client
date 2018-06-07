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
        let params = {orderby: 'realname'};
        Object.assign(params, query);
        console.log(params)
        return request({
            url: Util.apiUrl("/users"),
            method: "get",
            params
        });
    }
};
