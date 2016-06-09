module.exports = PostCardDirective;

PostCardDirective.$inject = [];
function PostCardDirective() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            post:  '=',
            canSelect: '=',
            selectedPosts: '='
        },
        templateUrl: 'templates/posts/card.html',
        link: function ($scope) {
            activate();

            function activate() {
                // Don't need this yet since forms don't have colors yet.
                // loadForm($scope.post.form);
            }

            /* function loadForm(form) {
                // Replace form with full object
                if (form) {
                    FormEndpoint.get({id: form.id}, function (form) {
                        $scope.post.form = form;
                    });
                }
            } */
        }
    };
}

