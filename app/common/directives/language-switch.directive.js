module.exports = LanguageSwitchDirective;

LanguageSwitchDirective.$inject = [];

function LanguageSwitchDirective() {
    return {
        restrict: 'E',
        scope: {
            site: '=?'
        },
        controller: LanguageSwitchController,
        template: require('./language-switch.html')
    };
}
LanguageSwitchController.$inject = ['$rootScope','$scope', '$translate', 'Languages', 'ConfigEndpoint'];
function LanguageSwitchController($rootScope, $scope, $translate, Languages, ConfigEndpoint) {
    $scope.changeLanguage = changeLanguage;

    activate();

    function activate() {
        Languages.then(function (languages) {
            $scope.languages = languages;
        });
    }

    function changeLanguage(code) {
        ConfigEndpoint.setLanguageCache(code);
        $translate.use(code).then(function (code) {
            Languages.then(function (languages) {
                angular.forEach(languages, function (language) {
                    if (language.code === code) {
                        $rootScope.rtlEnabled = language.rtl;
                    }
                });
            });
        });
    }
}

