module.exports = AddLanguageDirective;

AddLanguageDirective.$inject = [];

function AddLanguageDirective() {
    return {
        restrict: 'E',
        controller: AddLanguageController,
        template: require('./add-language.html')
    };
}
AddLanguageController.$inject = ['$rootScope','$scope', 'ModalService','UtilsSdk'];

function AddLanguageController($rootScope, $scope, ModalService, UtilsSdk) {
    $scope.selectLanguage = selectLanguage;
    $scope.selectedLanguage = '';
    $scope.add = add;
    $scope.cancel = cancel;

    function activate() {
        UtilsSdk.getLanguages().then(languages => {
            $scope.languagesToSelect = languages.results;
        });
    }
    activate();

    function selectLanguage(language) {
        if ($scope.enabledLanguages.available.indexOf(language) > -1 || $scope.enabledLanguages.default === language) {
            $scope.showLangError = true;
            $scope.langError = 'You cannot select this language since ';
            $scope.langError = $scope.enabledLanguages.default === language ?  `${$scope.langError} it is the default language for this survey.` : `${$scope.langError} there is already a translation for it.`;
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
            $scope.enabledLanguages.available.push($scope.selectedLanguage);
            ModalService.close();
        }
    }
}
