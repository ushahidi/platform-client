module.exports = [
    '$http',
    'Util',
    'ModalService',
    'Session',
    'TermsOfServiceEndpoint',
    'CONST',
    '$rootScope',
    '$q',
    'Notify',
    'moment',

function (
    $http,
    Util,
    ModalService,
    Session,
    TermsOfServiceEndpoint,
    CONST,
    $rootScope,
    $q,
    Notify,
    moment
) {

    return {

        getTosEntry: function () {

            return TermsOfServiceEndpoint.get()
            .$promise.then(function (tosEntry) {
                return tosCheck(tosEntry);
            });
        }
    };

    function tosCheck(tosEntry) {
        var deferred = $q.defer();
        var agreementDate;

        // If the tos agreement date is after the to the release date, then resolve
        // Otherwise (the tos agreement is before the release date or the user has never signed) We need to show the ToS modal
        if (tosEntry.results.length && moment(agreementDate).isAfter(CONST.TOS_RELEASE_DATE)) {
            deferred.resolve();
        } else {
            Notify.confirmTos().then(function () {
                deferred.resolve();
            }, function () {
                deferred.reject();
            });
        }

        return deferred.promise;
    }
}];

