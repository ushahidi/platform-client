module.exports = [
    '$http',
    'Util',
    'ModalService',
function (
    $http,
    Util,
    ModalService
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
        },

        openReset: function () {
            ModalService.openTemplate('<password-reset></password-reset>', 'nav.forgotyourpassword', false, false, true, false);
        },

        openResetConfirm: function (scope) {
            ModalService.openTemplate('<password-reset-confirm></password-reset-confirm>', 'nav.resetpassword', false, scope, true, false);
        }
    };

}];
