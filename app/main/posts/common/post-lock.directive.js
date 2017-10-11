module.exports = PostLockDirective;

PostLockDirective.$inject = ['UserEndpoint', 'PostLockService', 'Notify'];
function PostLockDirective(UserEndpoint, PostLockService, Notify) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            post:  '='
        },
        template: require('./post-lock.html'),
        link: function ($scope) {

            $scope.canUnlock = false;
            $scope.user = undefined;

            $scope.unlock = unlock;

            activate();

            function activate() {
                $scope.canUnlock = userHasUnlockPermission();
                UserEndpoint.get({id: $scope.post.lock.user_id}).$promise.then(function (result) {
                    $scope.user = result;
                });
            }

            function unlock() {
                PostLockService.unlockByPost($scope.post).then(function () {
                    $scope.post.lock = undefined;
                });
            }

            function userHasUnlockPermission() {
                return $scope.post.allowed_privileges.indexOf('update') !== -1;
            }
        }
    };
}
