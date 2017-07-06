module.exports = [
    '$http',
    'Util',
    'ModalService',
    'Session',
function (
    $http,
    Util,
    ModalService,
    Session
) {

    return {

        tosCheck: function (bool) {
            if (!bool) {
                this.openTos();
            }
        },

        openTos: function () {
            ModalService.openTemplate('<terms-of-service></terms-of-service>', ' ', false, false, false, false);
        },

        submitTos: function (date) {
            var payload = {
                date: date,
                email: Session.email
            };

            return $http.post(Util.apiUrl(''), payload);
        }

    };

}];

