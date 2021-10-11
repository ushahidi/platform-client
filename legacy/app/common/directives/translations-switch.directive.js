module.exports = TranslationSwitchDirective;

TranslationSwitchDirective.$inject = [];

function TranslationSwitchDirective() {
    return {
        restrict: 'E',
        scope: {
            languages:'=',
            languagesToSelect:'=',
            removeLanguage:'&'
        },
        controller: TranslationSwitchController,
        template: require('./translations-switch.html')
    };
}
TranslationSwitchController.$inject = ['$scope', 'ModalService'];

function TranslationSwitchController($scope, ModalService) {
    activate();

    function activate() {
    }

    $scope.switchToLanguage = function(language) {
        $scope.languages.active = language;
    };

    $scope.openLanguages = function() {
        ModalService.openTemplate('<add-language></add-language>', 'form.select_language', false, $scope, true, true);
    }
}
