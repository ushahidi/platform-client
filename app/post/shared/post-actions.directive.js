module.exports = [
    '$rootScope',
    '$translate',
    'PostEndpoint',
    'Notify',
    '$location',
    'PostActionsService',
    'PostStatusService',
function (
    $rootScope,
    $translate,
    PostEndpoint,
    Notify,
    $location,
    PostActionsService,
    PostStatusService
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

            $scope.statuses = PostStatusService.getStatuses();

            $scope.toggleDropDown = function () {
                $scope.showDropDown = !$scope.showDropDown;
            };

            $scope.delete = function (post) {
                PostActionsService.delete(post).then(function () {
                    $location.path('/views/list');
                });
            };

            $scope.edit = function (post) {
                $location.path('/posts/' + post.id + '/edit');
            };

            $scope.updateStatus = function (status) {
                $scope.post.status = status;

                PostEndpoint.update($scope.post).$promise.then(function () {
                    Notify.notify('notify.post.save_success', { name: $scope.post.title });
                }, function (errorResponse) {
                    Notify.apiErrors(errorResponse);
                });
            };
        }
    };
}];
