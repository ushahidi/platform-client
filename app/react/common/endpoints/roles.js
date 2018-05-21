import Util from "common/services/util";
// import 'react/common/fetchInterceptor';

export default {
    getRoles() {
        const headers = new Headers();
        headers.set("Content-Type", "application/json");
        headers.set(
            "Authorization",
            "Bearer fl5mFiB4eIJVBDVLqCn5G39v7OjiYNmCpej1rzk7"
        );
        return fetch(Util.apiUrl("/roles"), {
            method: "GET",
            headers
        })
            .then(res => {
                if (!res.ok) {
                    throw Error(res.statusText);
                }
                return res;
            })
            .then(res => res.json())
            .catch(() => {
                throw new Error("Couldn't get roles");
                // should probably be getting a specific error from the api
            });
    }
};
