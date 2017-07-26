module.exports = [
    '$rootScope',
    '$q',
    '$translate',
    '$document',
    'Languages',
    'Session',
    'Authentication',
    'UserEndpoint',
    'ConfigEndpoint',
function (
    $rootScope,
    $q,
    $translate,
    $document,
    Languages,
    Session,
    Authentication,
    UserEndpoint,
    ConfigEndpoint
) {
    var translate = function (lang) {
        $translate.use(lang).then(function (langKey) {
            if (langKey) {
                $translate.preferredLanguage(langKey);
                Languages.then(function (languages) {
                    angular.forEach(languages, function (language) {
                        if (language.code === langKey) {
                            $rootScope.rtlEnabled = language.rtl;
                        }
                    });
                });
            }
        });
        // Translating and setting page-title
        $rootScope.$emit('setPageTitle', $translate.instant($document[0].title));
    };

    var setStartLanguage = function () {
        getLanguage().then(function (language) {
            translate(language);
        });
    };

    var getLanguage = function () {
        return $q(function (resolve, reject) {
                if (Session.getSessionDataEntry('language')) {
                    resolve(Session.getSessionDataEntry('language'));
                }
                if (Authentication.getLoginStatus()) {
                    UserEndpoint.get({id: 'me'}).$promise.then(function (user) {
                        if (user.language) {
                            resolve(user.language);
                        }
                    });
                }
                ConfigEndpoint.get({id: 'site'}).$promise.then(function (site) {
                    site.language ? resolve(site.language) : resolve('en');
                });
            });
    };

    var setLanguage = function (code) {
        Session.setSessionDataEntry('language', code);
        if (Authentication.getLoginStatus()) {
            UserEndpoint.get({id: 'me'}).$promise.then(function (user) {
                user.language = code;
                UserEndpoint.update(user);
            });
        }
    };

    return {
        translate: translate,
        setStartLanguage: setStartLanguage,
        getLanguage: getLanguage,
        setLanguage: setLanguage
    };

}];
