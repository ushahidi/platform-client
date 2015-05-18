module.exports = [
function (
) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            active: '@'
        },
        templateUrl: 'templates/partials/post-view-tabs.html',
        link: function ($scope, $element, $attrs) {
            // Define available views
            $scope.views = ['list', 'map', 'graph', 'timeline'];
        }
    };
}];
