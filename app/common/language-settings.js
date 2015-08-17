module.exports = [
    '$rootScope',
    '$translate',
    'BootstrapConfig',
    'Languages',
function (
    $rootScope,
    $translate,
    BootstrapConfig,
    Languages
) {
    $rootScope.rtlEnabled = false;

    $translate.use(BootstrapConfig.language).then(function (langKey) {
        if (langKey) {
            $translate.preferredLanguage(BootstrapConfig.language);

            angular.forEach(Languages.languages, function (language) {
                if (language.code === BootstrapConfig.language) {
                    $rootScope.rtlEnabled = language.rtl;
                }
            });
        }
    });
}];
