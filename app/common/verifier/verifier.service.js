module.exports = [
    'Verifier',
    'Notify',
    '$rootScope',
    'Util',
function (
    Verifier,
    Notify,
    $rootScope,
    Util
) {
    return {
        debugModeCheck: function () {
                Verifier.checkDebugMode(Util.apiUrl('/verifier/db'))
                    .then(function (result) {
                        if (result) {
                            Notify.notifyPermanent(`You have debug-mode switched on. If you are an admin of this deployment, 
                            we recommend you disable this check and NOT leaving it enabled in the API. 
                        You may disable the check by running the "composer installdebug:disable" command in the API folder.`);
                        }
                    });
            }
    };
}
];

