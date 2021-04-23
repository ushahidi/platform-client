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
    $scope.site = {};
    activate();

    function activate() {
        Languages.then(function (languages) {
            $scope.languages = languages;
            TranslationService.getLanguage().then(lang =>{
                let deflangs = languages.filter(language => (language.code).toString().split('-')[0] === lang.split('-')[0]);
                $scope.site.language = deflangs.length === 1 ? deflangs[0].code : lang;
            })

        });
    }

    function changeLanguage(code) {
        if ($location.path() !== '/settings/general') {
            TranslationService.setLanguage(code);
            TranslationService.translate(code);
        }
    }
}

