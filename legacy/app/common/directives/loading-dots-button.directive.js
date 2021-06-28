module.exports = LoadingDotsButtonDirective;

LoadingDotsButtonDirective.$inject = [];

function LoadingDotsButtonDirective() {
    return {
        restrict: 'E',
        scope: {
            buttonClass: '@',
            label: '=',
            disabled: '='
        },
        controller: LoadingDotsButtonController,
        template: require('./loading-dots-button.html')
    };
}
LoadingDotsButtonController.$inject = ['$scope'];

function LoadingDotsButtonController($scope) {
}
