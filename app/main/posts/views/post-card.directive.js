module.exports = PostCardDirective;

PostCardDirective.$inject = ['FormEndpoint', 'PostLockService', '$rootScope'];
function PostCardDirective(FormEndpoint, PostLockService, $rootScope) {
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
                loadForm($scope.post.form);
            }

            function loadForm(form) {
                // Replace form with full object
                if (form) {
                    FormEndpoint.get({id: form.id}, function (form) {
                        $scope.post.form = form;
                    });
                }
            }

            function clickAction(evt) {
                let postActions = $element.find('post-actions')[0];
                // If the click was inside post-actions
                if (evt && $element && postActions.contains(evt.target)) {
                    // But ignore the action
                    return;
                }

                $scope.externalClickAction($scope.post);
            }
        }
    };
}
