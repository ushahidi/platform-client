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
            selectedPost: '='
        },
        controller: PostToolbarController,
        template: require('./post-toolbar.html')
    };
}

PostToolbarController.$inject = ['$scope', '$rootScope'];
function PostToolbarController($scope, $rootScope) {
    $scope.setEditMode = setEditMode;
    $scope.savePost = savePost;
    function savePost() {
        $rootScope.$broadcast('event:edit:post:data:mode:save');
    }

    function setEditMode() {
        $scope.editMode.editing = !$scope.editMode.editing ? true : false;
    }
}
