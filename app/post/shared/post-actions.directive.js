module.exports = PostActionsDirective;

PostActionsDirective.$inject = [
    'PostEndpoint',
    'Notify',
    '$location',
    'PostActionsService'
];
function PostActionsDirective(
    PostEndpoint,
    Notify,
    $location,
    PostActionsService
) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            post: '='
        },
        templateUrl: 'templates/posts/post-actions.html',
        link: PostActionsLink
    };

    function PostActionsLink($scope) {
        $scope.deletePost = deletePost;
        $scope.updateStatus = updateStatus;
        $scope.edit = edit;

        activate();

        function activate() {
            $scope.statuses = PostActionsService.getStatuses();
        }

        function deletePost() {
            PostActionsService.delete($scope.post).then(function () {
                $location.path('/views/list');
            });
        }

        function edit(post) {
            $location.path('/posts/' + post.id + '/edit');
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

