module.exports = AddLanguageDirective;

AddLanguageDirective.$inject = [];

function AddLanguageDirective() {
    return {
        restrict: 'E',
        scope: {
        },
        controller: AddLanguageController,
        template: require('./add-language.html')
    };
}
AddLanguageController.$inject = ['$rootScope','$scope'];

function AddLanguageController($rootScope, $scope) {
    activate();

    function activate() {

    }
}
