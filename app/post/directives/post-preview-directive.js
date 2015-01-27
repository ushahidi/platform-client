module.exports = ['TagEndpoint', 'UserEndpoint', function(TagEndpoint, UserEndpoint){
    return {
        restrict: 'E',
        replace: true,
        scope: {
            post: '='
        },
        templateUrl: 'templates/posts/preview.html',
        link: function(scope) {
            // Replace tags with full tag object
            scope.post.tags = scope.post.tags.map(function (tag) {
                return TagEndpoint.get({id: tag.id});
            });

            // Load the post author
            if (scope.post.user && scope.post.user.id) {
                scope.post.user = UserEndpoint.get({id: scope.post.user.id});
            }
        }
    };
}];
