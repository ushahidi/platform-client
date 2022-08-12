module.exports = PostCardDirective;

PostCardDirective.$inject = ['PostLockService', '$rootScope', 'UnifiedScopeForControllingLockInfos', 'PostActionCheck', '$state', 'Notify'];
function PostCardDirective(PostLockService, $rootScope, UnifiedScopeForControllingLockInfos, PostActionCheck, $state, Notify) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            post:  '=',
            canSelect: '=',
            selectedPosts: '=',
            shortContent: '@',
            externalClickAction: '=clickAction',
            selectedPost: '='
        },
        template: require('./card.html'),
        link: function ($scope, $element) {
            $scope.checkPostAction = checkPostAction;
            // broadcast $scope.post and action from post card to be used in post detail data
            $rootScope.$broadcast('postWithLock', $scope.post);
            $rootScope.$broadcast('action', checkPostAction());

            $scope.isPostLocked = isPostLocked;
            $scope.clickAction = clickAction;
            $scope.hasChangeStatusPrivilege = $scope.post.allowed_privileges.indexOf('change_status') !== -1;
            $scope.postIsUnlocked = function() {
                return !PostLockService.isPostLockedForCurrentUser($scope.post);
            };
            activate();

            $scope.stopClickPropagation = function ($event) {
                $event.stopPropagation();
            };

            function isPostLocked() {
                return PostLockService.isPostLockedForCurrentUser($scope.post);
            }

            console.log('POSTCARD POST: ', $scope.post)

            function postIsUnlocked() {
                return !PostLockService.isPostLockedForCurrentUser($scope.post);
            }

            function checkPostAction() {
                let data;
                data = {
                    showEdit: $scope.post.allowed_privileges.indexOf('update') !== -1 && postIsUnlocked(),
                    openEditMode: function(postId) {
                        console.log(postId);
                        // Ensure Post is not locked before proceeding
                        if (!postIsUnlocked()) {
                            Notify.error('post.already_locked');
                            return;
                        }

                        $state.go('posts.data.edit', {postId: postId});
                    },
                    showDivider: ($scope.post.allowed_privileges.indexOf('change_status') !== -1 || $scope.post.allowed_privileges.indexOf('update') !== -1) && postIsUnlocked(),
                    // showStatus: $scope.post.allowed_privileges.indexOf('change_status') !== -1 && postIsUnlocked(), // can't tell why this doesn't respond here
                    showDelete: $scope.post.allowed_privileges.indexOf('delete') !== -1 && postIsUnlocked()
                }

                if ($rootScope.isAdmin() && $scope.post.lock) {
                    data = {
                        showEdit: false,
                        openEditMode: function(postId) {
                            // Ensure Post is not locked before proceeding
                            if (!postIsUnlocked()) {
                                Notify.error('post.already_locked');
                                return;
                            }
                        },
                        showDivider: false,
                        showDelete: false
                    }
                }
                // console.log(data);
                return data;
            }

            function activate() {
            }

            function clickAction(evt) {
                let postActions = $element.find('post-actions')[0];
                // If the click was inside post-actions
                if (evt && $element && postActions.contains(evt.target)) {
                    // But ignore the action
                    return;
                }
                if (evt && evt.key && (evt.key !== ' ' && evt.key !== 'Enter' && evt.key !== 'Spacebar')) {
                  return;
                }

                $scope.externalClickAction($scope.post);

                PostActionCheck.setState(checkPostAction());

                 // Set method to the (post detail) transfer service (on post card click)
                UnifiedScopeForControllingLockInfos.setPostForShowingLockInAnyView($scope.post);
            }
        }
    };
}
