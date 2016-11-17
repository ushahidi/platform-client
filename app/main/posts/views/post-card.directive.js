module.exports = PostCardDirective;

PostCardDirective.$inject = ['FormEndpoint'];
function PostCardDirective(FormEndpoint) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            post:  '=',
            canSelect: '=',
            selectedPosts: '=',
            shortContent: '@'
        },
        template: require('./card.html'),
        link: function ($scope) {
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
