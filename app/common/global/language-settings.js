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

            Languages.then(function (languages) {
                angular.forEach(languages, function (language) {
                    if (language.code === BootstrapConfig.language) {
                        $rootScope.rtlEnabled = language.rtl;
                    }
                });
            });
        }
    });
}];
