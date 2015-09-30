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
    var lang = BootstrapConfig.language || 'en-US';

    $rootScope.rtlEnabled = false;

    $translate.use(lang).then(function (langKey) {
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
