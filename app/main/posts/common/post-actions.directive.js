module.exports = PostActionsDirective;

PostActionsDirective.$inject = [
    'PostEndpoint',
    'Notify',
    '$location',
    '$route',
    'PostActionsService'
];
function PostActionsDirective(
    PostEndpoint,
    Notify,
    $location,
    $route,
    PostActionsService
) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            post: '='
        },
        template: require('./post-actions.html'),
        link: PostActionsLink
    };

    function PostActionsLink($scope) {
        $scope.deletePost = deletePost;
        $scope.updateStatus = updateStatus;
        $scope.postLocked = false;

        activate();

        function activate() {
            $scope.statuses = PostActionsService.getStatuses();
            checkPostLockStatus();
        }

        function checkPostLockStatus() {
            // Check if post is locked for editing
            PostEndpoint.checkLock({id: $scope.post.id}).$promise.then(function (result) {
                $scope.postLocked = result.post_locked;
            });
        }

        function deletePost() {
            PostActionsService.delete($scope.post).then(function () {
                // If we're not already on some top level view
                if ($location.path().indexOf('views') === -1 &&
                    $location.path().indexOf('collections') === -1 &&
                    $location.path().indexOf('savedsearches') === -1) {
                    // Redirect to list
                    $location.path('/views/list');
                } else {
                    $route.reload();
                }
            });
        }

        function updateStatus(status) {
            $scope.post.status = status;

            PostEndpoint.update($scope.post).$promise.then(function () {
                Notify.notify('notify.post.save_success', { name: $scope.post.title });
            }, function (errorResponse) {
                Notify.apiErrors(errorResponse);
            });
        }
    }
}
