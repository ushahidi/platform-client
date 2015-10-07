module.exports = [
    '$location',
    'PostViewHelper',
function (
    $location,
    PostViewHelper
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

            $scope.views = PostViewHelper.views();

        }
    };
}];
