module.exports = PostActionsDirective;

PostActionsDirective.$inject = [
    '$rootScope',
    'PostEndpoint',
    'Notify',
    '$location',
    '$route',
    'PostActionsService',
    'PostLockService'
];
function PostActionsDirective(
    $rootScope,
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
            selectedPosts: '=',
            editMode: '='
        },
        template: require('./post-actions.html'),
        link: PostActionsLink
    };

    function PostActionsLink($scope) {
        $scope.deletePost = deletePost;
        $scope.updateStatus = updateStatus;
        $scope.openEditMode = openEditMode;
        $scope.postIsUnlocked = postIsUnlocked;

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

        function postIsUnlocked() {
            return !PostLockService.isPostLockedForCurrentUser($scope.post);
        }

        function openEditMode(id) {
            // Ensure Post is not locked before proceeding
            if (!postIsUnlocked()) {
                Notify.error('post.already_locked');
                return;
            }
            /**
             * keep the same post obj reference if we got one from the parent
             * if not, recreate the object
             */
            if ($scope.selectedPost && $scope.selectedPost.post) {
                $scope.selectedPost.post = $scope.post ;
            } else {
                $scope.selectedPost = {post: $scope.post};
            }
            if ($location.path().indexOf('data') === -1) {
                $location.path('/posts/' + id + '/edit');
            } else if ($scope.editMode.editing) {
                $rootScope.$broadcast('event:edit:leave:form');
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
