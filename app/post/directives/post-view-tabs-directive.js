module.exports = [
    '$location',
    'ViewHelper',
function (
    $location,
    ViewHelper
) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            active: '=',
            baseUrl: '@'
        },
        templateUrl: 'templates/posts/post-view-tabs.html',
        link: function ($scope, $element, $attrs) {

            $scope.views = ViewHelper.views();

        }
    };
}];
