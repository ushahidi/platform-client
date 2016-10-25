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

LayoutClassController.$inject = ['$scope', '$rootScope', '$window'];
function LayoutClassController($scope, $rootScope, $window) {
    var isEmbed = ($window.self !== $window.top) ? true : false;
    if (!isEmbed) {
        $rootScope.setLayout('layout-' + $scope.layout);
    } else {
        // If we are in embed mode
        // we must append the layout to the embed layout
        $rootScope.setLayout('layout-embed layout-' + $scope.layout);
    }
}
