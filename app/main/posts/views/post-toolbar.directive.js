module.exports = PostToolbarDirective;

PostToolbarDirective.$inject = [];
function PostToolbarDirective() {
    return {
        restrict: 'E',
        scope: {
            filters: '=',
            currentView: '=',
            editMode: '=',
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

    $scope.isLoading = $rootScope.isLoading;
    $scope.savingPost = $rootScope.savingPost;
    $scope.loading = LoadingProgress.getLoadingState();
    LoadingProgress.subscribeOnLoadingState(function (loading) {
        $scope.loading = loading;
    });

    function editEnabled() {
        return $scope.selectedPost ? !PostLockService.isPostLockedForCurrentUser($scope.selectedPost) : false;
    }

    function savePost() {
        $rootScope.$broadcast('event:edit:post:data:mode:save');
    }

    function setEditMode() {
        if (editEnabled()) {
            if ($scope.editMode.editing) {
                $rootScope.$broadcast('event:edit:leave:form');
            } else {
                $state.go('list.data.edit', {postId: $scope.selectedPost.id}, {reload: true});
                $scope.editMode.editing = true;
            }
        }
    }
}
