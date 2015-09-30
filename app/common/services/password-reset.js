module.exports = [
    '$http',
    'Util',
function (
    $http,
    Util
) {

    return {

        reset: function (email) {
            var payload = {
                email: email
            };

            return $http.post(Util.apiUrl('/passwordreset'), payload);
        },

        resetConfirm: function (token, password) {
            var payload = {
                token: token,
                password: password
            };

            return $http.post(Util.apiUrl('/passwordreset/confirm'), payload);
        }
    };

}];
