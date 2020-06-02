module.exports = TranslationSwitchDirective;

TranslationSwitchDirective.$inject = [];

function TranslationSwitchDirective() {
    return {
        restrict: 'E',
        scope: {
            defaultLanguage:'=',
            activeLanguage:'=',
            enabledLanguages:'=',
            removeLanguage:'&'
        },
        controller: TranslationSwitchController,
        template: require('./translation-switch.html')
    };
}
TranslationSwitchController.$inject = ['$scope', 'ModalService'];

function TranslationSwitchController($scope, ModalService) {
    activate();

    function activate() {
    }

    $scope.switchToLanguage = function(language) {
        $scope.activeLanguage = language;
    };

    $scope.openLanguages = function() {
        ModalService.openTemplate('<add-language></add-language>', 'form.select_language', false, $scope, true, true);
    }
}
