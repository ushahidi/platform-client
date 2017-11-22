module.exports = PostToolbarDirective;

PostToolbarDirective.$inject = [];
function PostToolbarDirective() {
    return {
        restrict: 'E',
        scope: {
            filters: '=',
            selectedPost: '='
        },
        controller: PostToolbarController,
        template: require('./post-toolbar.html')
    };
}

PostToolbarController.$inject = ['$scope', '$rootScope', 'Notify', 'PostLockService', '$state', 'LoadingProgress'];
function PostToolbarController($scope, $rootScope, Notify, PostLockService, $state, LoadingProgress) {
    $scope.setEditMode = setEditMode;
    $scope.savePost = savePost;
    $scope.hasPermission = $rootScope.hasPermission('Manage Posts');
    $scope.editEnabled = editEnabled;
    $scope.isLoading = LoadingProgress.getLoadingState;
    $scope.isSaving = LoadingProgress.getSavingState;
    $scope.editMode = editMode;
    $scope.cancel = cancel;


    function editEnabled() {
        if (!$scope.selectedPost || !$scope.hasPermission) {
            return false;
        }

        return $scope.selectedPost ? !PostLockService.isPostLockedForCurrentUser($scope.selectedPost) : false;
    }

    function savePost() {
        $rootScope.$broadcast('event:edit:post:data:mode:save');
    }

    function editMode() {
        return $state.$current.name === 'posts.data.edit';
    }

    function setEditMode() {
        if (editEnabled()) {
            $state.go('posts.data.edit', {postId: $scope.selectedPost.id});
        }
    }

    function cancel() {
        $state.go('posts.data.detail', {postId: $scope.selectedPost.id});
    }
}
