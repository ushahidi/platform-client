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

PostToolbarController.$inject = ['$scope', '$rootScope', 'Notify'];
function PostToolbarController($scope, $rootScope, Notify) {
    $scope.setEditMode = setEditMode;
    $scope.savePost = savePost;
    $scope.hasPermission = $rootScope.hasPermission('Manage Posts');

    function savePost() {
        $rootScope.$broadcast('event:edit:post:data:mode:save');
    }

    function setEditMode() {
        if ($scope.editMode.editing) {
            $rootScope.$broadcast('event:edit:leave:form');
        } else {
            $scope.editMode.editing = true;
        }
    }
}
