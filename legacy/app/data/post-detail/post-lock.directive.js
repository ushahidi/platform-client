module.exports = PostLockDirective;

PostLockDirective.$inject = ['UserEndpoint', 'PostLockService', '$rootScope', 'UnifiedScopeForControllingLockInfos', '$stateParams', '$state'];
function PostLockDirective(UserEndpoint, PostLockService, $rootScope, UnifiedScopeForControllingLockInfos, $stateParams, $state) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            post:  '='
        },
        template: require('./post-lock.html'),
        link: function ($scope) {

            // broadcast is from Post Card directive
            $scope.$on('postWithLock', function ($event, postFromCard) {
                if (postFromCard.id === Number($stateParams.postId)) {
                    // Set method to the (post detail) transfer service (on load)
                    UnifiedScopeForControllingLockInfos.setPostForShowingLockInAnyView(postFromCard);
                    getUserDetails();
                }
            });

            $scope.canUnlock = false;
            $scope.user = {};

            $scope.unlock = unlock;

            $scope.showLockMessage = showLockMessage;
            $scope.isAdmin = $rootScope.isAdmin;

            activate();

            function getUserDetails() {
                try {
                    let postFromPostCard = UnifiedScopeForControllingLockInfos.getPostFromPostCard();
                    console.log('postFromPostCard: ', postFromPostCard)
                    if ($rootScope.isAdmin()) {
                        UserEndpoint.get({id: postFromPostCard.lock.user.id}).$promise.then(function (result) {
                            console.log('result: ', result);
                            $scope.user = result;
                        });
                    }
                } catch (err) {}
            }

            function activate() {
                $scope.canUnlock = userHasUnlockPermission();
                getUserDetails();
            }

            function showLockMessage() {
                let postFromPostCard = UnifiedScopeForControllingLockInfos.getPostFromPostCard();
                return PostLockService.isPostLockedForCurrentUser(postFromPostCard);
            }

            function unlock() {
                PostLockService.unlockByPost($scope.post).then(function () {
                    $scope.post.lock = undefined;
                });
                $state.reload();
            }

            function userHasUnlockPermission() {
                return $scope.post.allowed_privileges.indexOf('update') !== -1;
            }
        }
    };
}
