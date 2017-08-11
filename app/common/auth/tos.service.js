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

        // If there is a result from the DB
        // Convert the timestamp to JS readable date
        if (tosEntry.results.length) {
            // var timestamp = tosEntry.results[0].agreement_date;
            // var jsTimestamp = timestamp * 1000;
            agreementDate = moment.utc(tosEntry.results[0].agreement_date * 1000).format();
        }

        // if the tos agreement date is after the to the release date, then resolve
        // Otherwise (the tos agreement is before the release date or the user has never signed) We need to show the ToS modal
        if (tosEntry.results.length && agreementDate >= CONST.TOS_RELEASE_DATE) {
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

