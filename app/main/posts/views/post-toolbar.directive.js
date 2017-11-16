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

    $scope.isLoading = LoadingProgress.getLoadingState();
    $scope.isSaving = LoadingProgress.getSavingState();

    LoadingProgress.subscribeOnLoadingState(function (isLoading) {
        $scope.isLoading = isLoading;
    });
    LoadingProgress.subscribeOnSavingState(function (isSaving) {
        $scope.isSaving = isSaving;
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
