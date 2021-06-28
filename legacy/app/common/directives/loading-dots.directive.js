module.exports = LoadingDotsDirective;

LoadingDotsDirective.$inject = [];

function LoadingDotsDirective() {
    return {
        restrict: 'E',
        scope: {
            buttonClass: '@',
            label: '=',
            disabled: '='
        },
        controller: LoadingDotsController,
        template: require('./loading-dots.html')
    };
}
LoadingDotsController.$inject = ['$scope'];

function LoadingDotsController($scope) {
}
