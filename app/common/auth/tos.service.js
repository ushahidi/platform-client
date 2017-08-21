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
            // If no TOS date definied, just skip
            if (!CONST.TOS_RELEASE_DATE) {
                return $q.resolve(true);
            }

            return TermsOfServiceEndpoint.get()
            .$promise.then(function (tosEntry) {
                return tosCheck(tosEntry);
            });
        }
    };

    function tosCheck(tosEntry) {
        var deferred = $q.defer();

        // If the tos agreement date is after the to the release date, then resolve
        // Otherwise (the tos agreement is before the release date or the user has never signed) We need to show the ToS modal
        if (tosEntry.results.length && moment(tosEntry.results[0].agreement_date).isAfter(CONST.TOS_RELEASE_DATE)) {
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

