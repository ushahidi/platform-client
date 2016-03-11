module.exports = [
    '$rootScope',
    '$translate',
    'ConfigEndpoint',
    'BootstrapConfig',
    'Languages',
function (
    $rootScope,
    $translate,
    ConfigEndpoint,
    BootstrapConfig,
    Languages
) {
    var lang = BootstrapConfig.language || 'en-US';

    ConfigEndpoint.get({ id: 'site' }).$promise.then(function (site) {
        lang = site.language ? site.language : 'en-US';
    });

    $rootScope.rtlEnabled = false;

    $translate.use(lang).then(function (langKey) {
        if (langKey) {
            $translate.preferredLanguage(lang);

            Languages.then(function (languages) {
                angular.forEach(languages, function (language) {
                    if (language.code === lang) {
                        $rootScope.rtlEnabled = language.rtl;
                    }
                });
            });
        }
    });
}];
