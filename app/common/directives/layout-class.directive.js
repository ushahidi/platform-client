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
    // In the case of map we omit the layout-a class
    var isMap = $window.location.href.includes('map');

    if (!isEmbed) {
        $rootScope.setLayout('layout-' + $scope.layout);
    } else if (isEmbed && isMap) {
        $rootScope.setLayout('layout-embed');
    } else {
        // If we are in embed mode
        // we must append the layout to the embed layout
        $rootScope.setLayout('layout-embed layout-' + $scope.layout);
    }
}
