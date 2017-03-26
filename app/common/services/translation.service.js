module.exports = [
    '$rootScope',
    '$q',
    '$translate',
    'Languages',
    'Session',
    'Authentication',
    'UserEndpoint',
    'ConfigEndpoint',
function (
    $rootScope,
    $q,
    $translate,
    Languages,
    Session,
    Authentication,
    UserEndpoint,
    ConfigEndpoint
) {
    var translate = function (language) {
        $translate.use(language).then(function (langKey) {
            if (langKey) {
                $translate.preferredLanguage(language);
                Languages.then(function (languages) {
                    angular.forEach(languages, function (language) {
                        if (language.code === language) {
                            $rootScope.rtlEnabled = language.rtl;
                        }
                    });
                });
            }
        });
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
        Session.setSessionDataEntry({language: code});
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
