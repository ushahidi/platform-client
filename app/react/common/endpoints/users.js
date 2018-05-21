import Util from "common/services/util";
// import 'react/common/fetchInterceptor';

// For testing since Jest doesn't have access to window
const safeURL = window.ushahidi.backendUrl
    ? Util.apiUrl("/users")
    : "http://192.168.33.110/api/v3/users";
export default {
    saveUser(user) {
        const headers = new Headers();
        headers.set("Content-Type", "application/json");
        headers.set(
            "Authorization",
            "Bearer y5IXDPEFKAuFMN9zWXuq1gkDVl8YfjSZCs6sj6XD"
        );
        return fetch(safeURL, {
            method: "POST",
            body: JSON.stringify(user),
            headers
        }).then(response => response.json());
    }
};
