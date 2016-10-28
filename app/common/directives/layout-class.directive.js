module.exports = LayoutClassDirective;

LayoutClassDirective.$inject = [];
function LayoutClassDirective() {
    return {
        restrict: 'E',
        scope: {
            layout: '@'
        },
        controller: LayoutClassController
    };
}

LayoutClassController.$inject = ['$scope', '$rootScope'];
function LayoutClassController($scope, $rootScope) {
    $rootScope.setLayout('layout-' + $scope.layout);
}
