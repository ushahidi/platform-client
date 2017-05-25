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
LanguageSwitchController.$inject = ['$scope', 'Languages', 'TranslationService'];
function LanguageSwitchController($scope, Languages, TranslationService) {
    $scope.changeLanguage = changeLanguage;
    $scope.$on('event:authentication:login:succeeded', TranslationService.setStartLanguage);
    $scope.$on('event:authentication:logout:succeeded', TranslationService.setStartLanguage);
    activate();

    function activate() {
        Languages.then(function (languages) {
            $scope.languages = languages;
        });
    }

    function changeLanguage(code) {
        TranslationService.setLanguage(code);
        TranslationService.translate(code);
    }
}

