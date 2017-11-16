module.exports = PostToolbarDirective;

PostToolbarDirective.$inject = [];
function PostToolbarDirective() {
    return {
        restrict: 'E',
        scope: {
            isLoading: '=',
            filters: '=',
            currentView: '=',
            editMode: '=',
            selectedPost: '=',
            savingPost: '='
        },
        controller: PostToolbarController,
        template: require('./post-toolbar.html')
    };
}

PostToolbarController.$inject = ['$scope', '$rootScope', 'Notify', 'PostLockService', '$state'];
function PostToolbarController($scope, $rootScope, Notify, PostLockService, $state) {
    $scope.setEditMode = setEditMode;
    $scope.savePost = savePost;
    $scope.hasPermission = $rootScope.hasPermission('Manage Posts');
    $scope.editEnabled = editEnabled;
    $scope.saveButtonEnabled = saveButtonEnabled;
    function editEnabled() {
        return $scope.selectedPost ? !PostLockService.isPostLockedForCurrentUser($scope.selectedPost) : false;
    }

    function savePost() {
        $rootScope.$broadcast('event:edit:post:data:mode:save');
    }
    function saveButtonEnabled() {
        return $state.$current.name === 'posts.data.edit';
    }

    function setEditMode() {
        if (editEnabled()) {
            if ($scope.editMode.editing) {
                $state.go('posts.data.detail', {postId: $scope.selectedPost.id});
            } else {
                $state.go('posts.data.edit', {postId: $scope.selectedPost.id});
                $scope.editMode.editing = true;
            }
        }
    }
}
