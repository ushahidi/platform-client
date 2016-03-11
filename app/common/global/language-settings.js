module.exports = [
    '$rootScope',
    '$translate',
    'ConfigEndpoint',
    'Languages',
function (
    $rootScope,
    $translate,
    ConfigEndpoint,
    Languages
) {

    $rootScope.rtlEnabled = false;

    ConfigEndpoint.get({ id: 'site' }).$promise.then(function (site) {
        var lang = site.language ? site.language : 'en-US';
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
    });
}];
