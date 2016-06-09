module.exports = [
    '$rootScope',
    '$translate',
    'PostEndpoint',
    'Notify',
    '$location',
    'PostActionsService',
function (
    $rootScope,
    $translate,
    PostEndpoint,
    Notify,
    $location,
    PostActionsService
) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            post: '='
        },
        templateUrl: 'templates/posts/post-actions.html',
        link: function ($scope) {
            $scope.showDropDown = false;
            $scope.toggleDropDown = function () {
                $scope.showDropDown = !$scope.showDropDown;
            };

            $scope.delete = function (post) {
                PostActionsService.delete(post).then(function () {
                    $location.path('/views/list');
                });
            };
        }
    };
}];
