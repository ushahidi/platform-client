module.exports = [
    '$rootScope',
    '$translate',
    'Config',
    'Languages',
function (
    $rootScope,
    $translate,
    Config,
    Languages
) {
    var lang = Config.site.language || 'en-US';

    $rootScope.rtlEnabled = false;

    $translate.use(lang).then(function (langKey) {
        if (langKey) {
            $translate.preferredLanguage(Config.site.language);

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
