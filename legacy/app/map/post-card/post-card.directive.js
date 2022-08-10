module.exports = PostCardDirective;

PostCardDirective.$inject = ['PostLockService', '$rootScope', 'UnifiedScopeForShowingLockInMetadata'];
function PostCardDirective(PostLockService, $rootScope, UnifiedScopeForShowingLockInMetadata) {
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
            // broadcast $scope.post from post card to be used in post detail data
            $rootScope.$broadcast('postWithLock', $scope.post);

            $scope.isPostLocked = isPostLocked;
            $scope.clickAction = clickAction;
            activate();

            $scope.stopClickPropagation = function ($event) {
                $event.stopPropagation();
            };

            function isPostLocked() {
                return PostLockService.isPostLockedForCurrentUser($scope.post);
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

                 // Set method to the (post detail) transfer service (on post card click)
                UnifiedScopeForShowingLockInMetadata.setPostForShowingLockInAnyView($scope.post);
            }
        }
    };
}
