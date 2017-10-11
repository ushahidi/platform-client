module.exports = PostCardDirective;

PostCardDirective.$inject = ['FormEndpoint', '$rootScope'];
function PostCardDirective(FormEndpoint, $rootScope) {
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
            $rootScope.$on('bulkActionsSelected:true', function () {
                $scope.canSelect = true;
            });
            $rootScope.$on('bulkActionsSelected:false', function () {
                $scope.canSelect = false;
            });
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
