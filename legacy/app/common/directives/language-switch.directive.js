const { lang } = require('moment');

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
LanguageSwitchController.$inject = ['$scope', 'Languages', 'TranslationService', '$location'];
function LanguageSwitchController($scope, Languages, TranslationService, $location) {
    $scope.changeLanguage = changeLanguage;
    $scope.$on('event:authentication:login:succeeded', TranslationService.setStartLanguage);
    $scope.$on('event:authentication:logout:succeeded', TranslationService.setStartLanguage);
    activate();

    function activate() {
        $scope.languages = Languages.getLanguages();
    }

    function changeLanguage(code) {
        if ($location.path() !== '/settings/general') {
            TranslationService.setLanguage(code);
            TranslationService.translate(code);
        }
    }
}

