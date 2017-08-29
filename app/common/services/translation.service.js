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

    var getLanguage = function (config) {
        return $q(function (resolve, reject) {
                if (Session.getSessionDataEntry('language')) {
                    resolve(Session.getSessionDataEntry('language'));
                    return;
                }

                let configRequest = $q.when(config ? config : ConfigEndpoint.get({id: 'site'}).$promise);
                let userRequest = $q.when(false);

                if (Authentication.getLoginStatus()) {
                    userRequest = UserEndpoint.get({id: 'me'}).$promise;
                }

                $q.all({
                    user: userRequest,
                    config: configRequest
                }).then(function (result) {
                    if (result.user && result.user.language) {
                        resolve(result.user.language);
                    } else if (result.config.language) {
                        resolve(result.config.language);
                    } else {
                        resolve('en');
                    }
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
