module.exports = [
    '$location',
function (
    $location
) {
    return {
        restrict: 'E',
        scope: {
            active: '=',
            baseUrl: '@'
        },
        templateUrl: 'templates/posts/post-view-tabs.html',
        link: function ($scope, $element, $attrs) {
            // Define available views
            $scope.views = [
                'list',
                'map',
                'chart',
                'timeline'
            ];
        }
    };
}];
