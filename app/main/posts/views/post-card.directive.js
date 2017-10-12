module.exports = PostCardDirective;

PostCardDirective.$inject = ['FormEndpoint', 'PostLockService'];
function PostCardDirective(FormEndpoint, PostLockService) {
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
            editMode: '='
        },
        template: require('./card.html'),
        link: function ($scope) {
            $scope.isPostLockedForCurrentUser = PostLockService.isPostLockedForCurrentUser($scope.post);
            activate();

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
