module.exports = PostLockDirective;

PostLockDirective.$inject = ['UserEndpoint', 'PostLockService'];
function PostLockDirective(UserEndpoint, PostLockService) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            post:  '='
        },
        template: require('./post-lock.html'),
        link: function ($scope) {
            activate();
            $scope.canUnlock = false;
            $scope.user = undefined;

            $scope.unlock = unlock;

            function activate() {
                $scope.canUnlock = userHasUnlockPermission();
                UserEndpoint.get({id: $scope.post.lock.user_id}).$promise.then(function (result) {
                    $scope.user = result;
                });
            }

            function unlock() {
                PostLockService.unLockByPost($scope.post);
            }

            function userHasUnlockPermission() {
                return $scope.post.allowed_privileges.indexOf('update') !== -1;
            }
        }
    };
}
