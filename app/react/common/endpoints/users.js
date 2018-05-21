import Util from "common/services/util";
// import 'react/common/fetchInterceptor';

export default {
    saveUser(user) {
        const headers = new Headers();
        headers.set("Content-Type", "application/json");
        headers.set(
            "Authorization",
            "Bearer eXJyiJuki5mvT4judKrTMqSUizZisvSi7ppbbIQT"
        );
        return fetch(Util.apiUrl("/users"), {
            method: "POST",
            body: JSON.stringify(user),
            headers
        }).then(response => response.json());
    }
};