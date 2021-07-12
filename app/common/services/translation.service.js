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
    'dayjs',
function (
    $rootScope,
    $q,
    $translate,
    $document,
    Languages,
    Session,
    Authentication,
    UserEndpoint,
    ConfigEndpoint,
    dayjs
) {
    var translate = function (lang) {
        if (lang) {
            $translate.use(lang).then(function (langKey) {
                if (langKey) {
                    $translate.preferredLanguage(langKey);
                    Languages.then(function (languages) {
                        let language = languages.find(l => l.code === langKey);

                        if ($rootScope.rtlEnabled !== language.rtl) {
                            if (language.rtl) {
                                require.ensure(
                                    ['ushahidi-platform-pattern-library/assets/css/rtl-style.min.css'], () => {
                                        $rootScope.$apply(() => {
                                            require('ushahidi-platform-pattern-library/assets/css/rtl-style.min.css');
                                            $rootScope.rtlEnabled = language.rtl;
                                        });
                                    }, 'rtl'
                                );
                            } else {
                                $rootScope.rtlEnabled = language.rtl;
                            }
                        }
                    });
                }
            });
            dayjs.locale('en');

            // Load locale
            require(['dayjs/locale/' + lang + '.js'], function () {
                // And then set dayjs locale
                dayjs.locale(lang.toLowerCase());
            }, function() { // if it fails attempt using the 2 letter language code
                var shortCode = lang.substr(0,2).toLowerCase();
                require(['dayjs/locale/' + shortCode + '.js'], function () {
                    dayjs.locale(shortCode);
                }, () => { console.error('Failed to load locale: ' + shortCode) });
            });

            // Translating and setting page-title
            $rootScope.$emit('setPageTitle', $translate.instant($document[0].title));
        }
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
        Session.setSessionDataEntry('language', code);
        if (Authentication.getLoginStatus()) {
            UserEndpoint.get({id: 'me'}).$promise.then(function (user) {
                user.language = code;
                UserEndpoint.update(user);
            });
        }
        $rootScope.$broadcast('language:changed');
    };

    return {
        translate: translate,
        setStartLanguage: setStartLanguage,
        getLanguage: getLanguage,
        setLanguage: setLanguage
    };

}];
