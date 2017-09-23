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
LanguageSwitchController.$inject = ['$scope', 'Languages', 'TranslationService', 'moment'];
function LanguageSwitchController($scope, Languages, TranslationService, moment) {
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
        console.log('Changing language to: ' + code);
        require(['moment/locale/' + code + '.js'], function () {
            moment.updateLocale(code);
            console.log('found: moment/locale/' + code + '.js');
        });
        TranslationService.setLanguage(code);
        TranslationService.translate(code);
    }
}
