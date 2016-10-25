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
    if ($rootScope.globalLayout !== 'layout-embed') {
        $rootScope.setLayout('layout-' + $scope.layout);
    } else {
        // If we are in embed mode
        // we must append the layout to the embed layout
        $rootScope.setLayout('layout-embed layout-' + $scope.layout);
    }
}
