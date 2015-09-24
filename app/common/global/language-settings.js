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

            angular.forEach(Languages.languages, function (language) {
                if (language.code === Config.site.language) {
                    $rootScope.rtlEnabled = language.rtl;
                }
            });
        }
    });
}];
