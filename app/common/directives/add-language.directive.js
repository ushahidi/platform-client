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
    $scope.cancel = cancel;

    function selectLanguage(language) {
        if ($scope.survey.enabled_languages.available.indexOf(language) > -1 || $scope.survey.enabled_languages.default === language) {
            $scope.showLangError = true;
            $scope.langError = 'You cannot select this language since ';
            $scope.langError = $scope.survey.enabled_languages.default === language ?  `${$scope.langError} it is the default language for this survey.` : `${$scope.langError} there is already a translation for it.`;
        } else {
            $scope.showLangError = false;
        }
    }
    function cancel() {
        ModalService.close();
    }
    function add() {
        if (!$scope.selectedLanguage) {
            $scope.langError = 'You need to select a language first';
            $scope.showLangError = true;
        }
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
