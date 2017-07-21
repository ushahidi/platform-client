module.exports = [
    '$http',
    'Util',
    'ModalService',
    'Session',
    'TermsOfServiceEndpoint',
    'CONST',
    '$rootScope',

function (
    $http,
    Util,
    ModalService,
    Session,
    TermsOfServiceEndpoint,
    CONST,
    $rootScope
) {

    return {

        tosCheck: function (tosEntry) {
                if (tosEntry.results.length) {
                    Session.setSessionDataEntry('tos', tosEntry.results[0].agreement_date);
                    if (Session.getSessionDataEntry('tos') && Session.getSessionDataEntry('tos') < CONST.TOS_RELEASE_DATE) {
                        $rootScope.$broadcast('event:authentication:tos:agreement');
                    }
                } else if (!tosEntry.results.length) {
                    $rootScope.$broadcast('event:authentication:tos:agreement');

                }
            },

        openTos: function () {
            ModalService.openTemplate('<terms-of-service></terms-of-service>', ' ', false, false, false, false);
        }

    };

}];

