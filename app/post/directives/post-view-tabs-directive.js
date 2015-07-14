module.exports = [
    '$location',
function (
    $location
) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            active: '=',
            baseUrl: '@'
        },
        templateUrl: 'templates/partials/post-view-tabs.html',
        link: function ($scope, $element, $attrs) {
            // Define available views
            $scope.views = ['list', 'map', 'chart', 'timeline'];
        }
    };
}];
