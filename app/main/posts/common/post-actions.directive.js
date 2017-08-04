module.exports = PostActionsDirective;

PostActionsDirective.$inject = [
    '$rootScope',
    'PostEndpoint',
    'Notify',
    '$location',
    '$route',
    'PostActionsService'
];
function PostActionsDirective(
    $rootScope,
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

        // TODO move to service
        function checkPostLockStatus() {
            // Check if post is locked for editing
            PostEndpoint.checkLock({id: $scope.post.id}).$promise.then(function (result) {
                $scope.postLocked = result.post_locked;
                if ($scope.postLocked) {
                    if ($rootScope.isAdmin || $scope.post.allowed_privileges.indexOf('update') !== -1) {
                        Notify.confirm('post.break_lock').then(function (result) {
                            PostEndpoint.breakLock({id: $scope.post.id}).$promise.then(function (result) {
                                Notify.success('post.lock_broken');
                                $location.url('/posts/' + $scope.post.id + '/edit');
                            }, function (error) {
                                Notify.error('post.failed_to_break');
                            });
                        }, function () {
                        });
                    } else {
                        Notify.error('post.already_locked');
                    }
                }
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
