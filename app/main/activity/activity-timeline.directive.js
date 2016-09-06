module.exports = [
function (
) {
    var controller = [
        '$scope',
        '$q',
        '$translate',
        'PostEndpoint',
        'UserEndpoint',
        '_',
        function (
            $scope,
            $q,
            $translate,
            PostEndpoint,
            UserEndpoint,
            _
        ) {

            /*
            Helper function to produce human friendly timestamps
            */
            $scope.timeSince = function (date) {

                var seconds = Math.floor((new Date() - date) / 1000);

                var interval = Math.floor(seconds / 31536000);

                if (interval > 1) {
                    return interval + ' years';
                }
                interval = Math.floor(seconds / 2592000);
                if (interval > 1) {
                    return interval + ' months';
                }
                interval = Math.floor(seconds / 86400);
                if (interval > 1) {
                    return interval + ' days';
                }
                interval = Math.floor(seconds / 3600);
                if (interval > 1) {
                    return interval + ' hours';
                }
                interval = Math.floor(seconds / 60);
                if (interval > 1) {
                    return interval + ' minutes';
                }
                return Math.floor(seconds) + ' seconds';
            };

            var getPostsForPagination = function (query) {
                query = query || { status: 'all' };
                var postQuery = _.extend({}, query, {
                    offset: ($scope.currentPage - 1) * $scope.itemsPerPage,
                    limit: $scope.itemsPerPage
                });

                $scope.isLoading = true;
                PostEndpoint.query(postQuery).$promise.then(function (postsResponse) {
                    $scope.posts = postsResponse.results;
                    $scope.isLoading = false;

                    /*
                    cool looking friendly timestamp - only appears
                    start of timeline.
                    */
                    var firspost_timestamp = new Date($scope.posts[0].created);
                    $scope.start_timestamp = $scope.timeSince(firspost_timestamp);

                    /*
                    quick hack to get user names but not efficient
                    since we end up making duplicate queries
                    */
                    $scope.posts.forEach(function (post) {
                        post.user = UserEndpoint.get({id: post.user.id});
                    });

                });
            };

            // --- start: initialization
            $scope.pageChanged = getPostsForPagination;
            $scope.currentPage = 1;
            $scope.itemsPerPageOptions = [10, 20, 50];
            $scope.itemsPerPage = $scope.itemsPerPageOptions[0];
            $scope.start_timestamp = null;
            // Initial load
            getPostsForPagination();
        }
    ];

    return {
        restrict: 'E',
        replace: true,
        scope: {
        },
        controller: controller,
        templateUrl: 'templates/activity/activity-timeline.html'
    };
}];
