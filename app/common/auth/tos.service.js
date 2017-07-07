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
        }

    };

}];

