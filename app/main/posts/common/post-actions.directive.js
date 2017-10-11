module.exports = PostActionsDirective;

PostActionsDirective.$inject = [
    'PostEndpoint',
    'Notify',
    '$location',
    '$route',
    'PostActionsService',
    'PostLockService'
];
function PostActionsDirective(
    PostEndpoint,
    Notify,
    $location,
    $route,
    PostActionsService,
    PostLockService
) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            post: '=',
            editMode: '='
        },
        template: require('./post-actions.html'),
        link: PostActionsLink
    };

    function PostActionsLink($scope) {
        $scope.deletePost = deletePost;
        $scope.updateStatus = updateStatus;
        $scope.openEditMode = openEditMode;
        activate();

        function activate() {
            $scope.statuses = PostActionsService.getStatuses();
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

        function editEnabled() {
            return !PostLockService.isPostLockedForCurrentUser($scope.post);
        }

        function openEditMode(id) {
            // Ensure Post is not locked before proceeding
            if (editEnabled) {
                Notify.error('post.already_locked');
                return;
            }
            if ($location.path() !== '/views/data') {
                $location.path('/posts/' + id + '/edit');
            } else {
                $scope.editMode.editing = true;
            }
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
