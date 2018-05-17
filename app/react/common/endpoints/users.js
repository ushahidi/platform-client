const makeUrl = relativeUrl => `http://192.168.33.110/api/v3${relativeUrl}`;
const url = makeUrl("/users");

export default {
    saveUser(user) {
        const headers = new Headers();
        headers.set("Content-Type", "application/json");
        headers.set(
            "Authorization",
            "Bearer sI84FsLcUMD1Pio9Td13L7rqn6PfXmcuP1rPkdmo"
        );
        return fetch(url, {
            method: "POST",
            body: JSON.stringify(user),
            headers
        }).then(response => response.json());
    }
};
