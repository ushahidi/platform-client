import axios from "axios";
import requestInterceptor from "./requestInterceptor";
import responseInterceptor from "./responseInterceptor";

const request = axios.create({
    // baseUrl: I would really like to set the backend url here
    // but window.ushahidi.backendUrl is undefined with this
    // is instantiated
});

requestInterceptor(request);
responseInterceptor(request);

export default request;
