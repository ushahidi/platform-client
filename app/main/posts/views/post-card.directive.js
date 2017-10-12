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
            inFocus: '=',
            shortContent: '@',
            clickAction: '=',
            editMode: '=',
            selectedPost: '='
        },
        template: require('./card.html'),
        link: function ($scope) {
            $scope.isPostLocked = isPostLocked;

            $rootScope.$on('bulkActionsSelected:true', function () {
                $scope.canSelect = true;
            });
            $rootScope.$on('bulkActionsSelected:false', function () {
                $scope.canSelect = false;
            });

            activate();

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
        }
    };
}
