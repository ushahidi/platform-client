module.exports = PostLockDirective;

PostLockDirective.$inject = ['UserEndpoint', 'PostLockService', 'Notify', '$rootScope'];
function PostLockDirective(UserEndpoint, PostLockService, Notify, $rootScope) {
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

            $scope.showLockMessage = showLockMessage;
            $scope.isAdmin = $rootScope.isAdmin;

            activate();

            function activate() {
                $scope.canUnlock = userHasUnlockPermission();
                UserEndpoint.get({id: $scope.post.lock.user.id}).$promise.then(function (result) {
                    $scope.user = result;
                });
            }

            function showLockMessage() {
                return PostLockService.isPostLockedForCurrentUser($scope.post);
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
