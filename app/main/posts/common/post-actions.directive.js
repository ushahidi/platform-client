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
        template: require('./post-actions.html'),
        link: PostActionsLink
    };

    function PostActionsLink($scope) {
        $scope.deletePost = deletePost;
        $scope.updateStatus = updateStatus;

        activate();

        function activate() {
            $scope.statuses = PostActionsService.getStatuses();
        }

        function deletePost() {
            PostActionsService.delete($scope.post).then(function () {
                $location.path('/views/list');
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
