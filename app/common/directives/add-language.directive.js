module.exports = AddLanguageDirective;

AddLanguageDirective.$inject = [];

function AddLanguageDirective() {
    return {
        restrict: 'E',
        controller: AddLanguageController,
        template: require('./add-language.html')
    };
}
AddLanguageController.$inject = ['$rootScope','$scope', 'ModalService'];

function AddLanguageController($rootScope, $scope, ModalService) {
    $scope.languagesToSelect = require('../../settings/surveys/language-list.json');
    $scope.selectLanguage = selectLanguage;
    $scope.selectedLanguage = '';
    $scope.add = add;
    function selectLanguage(language) {
        if ($scope.survey.enabled_languages.available.indexOf(language) > 1 || $scope.survey.enabled_languages.default === language) {
            $scope.showLangError = true;
        } else {
            $scope.showLangError = false;
        }
    }

    function add() {
        if (!$scope.showLangError) {
            $scope.switchToLanguage($scope.selectedLanguage);
            $scope.survey.enabled_languages.available.push($scope.selectedLanguage);
            ModalService.close();
        }
    }

    activate();
    function activate() {

    }
}
