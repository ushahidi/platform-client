export default function(request) {
    request.interceptors.response.use(
        response => response.data,
        error => Promise.reject(error.response)
    );
}
