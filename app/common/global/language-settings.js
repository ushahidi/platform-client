module.exports = [
    '$rootScope',
    '$translate',
    'ConfigEndpoint',
    'Languages',
    'moment',
function (
    $rootScope,
    $translate,
    ConfigEndpoint,
    Languages,
    moment
) {

    $rootScope.rtlEnabled = false;

    $rootScope.switchRtl = function () {
        $rootScope.rtlEnabled = !$rootScope.rtlEnabled;
    };
    var lang;

    if (ConfigEndpoint.getLanguageCache()) {
        lang = ConfigEndpoint.getLanguageCache();
        translate(lang);
    } else {
        ConfigEndpoint.get({ id: 'site' }).$promise.then(function (site) {
            lang = site.language ? site.language : 'en';
            translate(lang);
        });
    }

    function translate(lang) {
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

        if (lang !== 'en') {
            require(['moment/locale/' + lang + '.js'], function () {
                moment.locale(lang);
            });
        }
    }
}];
