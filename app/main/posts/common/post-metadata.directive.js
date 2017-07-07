module.exports = PostMetadataDirective;

PostMetadataDirective.$inject = [
    '$translate',
    '_',
    'moment',
    'PostMetadataService',
    'GisconStatusKey'
];
function PostMetadataDirective(
    $translate,
    _,
    moment,
    PostMetadataService,
    GisconStatusKey
) {
    return {
        restrict: 'E',
        scope: {
            post:  '=',
            // Should we hide the date for posts this week?
            hideDateThisWeek: '@?'
        },
        template: require('./post-metadata.html'),
        link: function ($scope) {
            //console.log($scope.post);
            $scope.visibleTo = '';
            $scope.displayTime = '';
            $scope.displayTimeFull = '';
            $scope.timeago = '';
            $scope.hideDateThisWeek = $scope.hideDateThisWeek || false;
            $scope.gisconStatusKey = GisconStatusKey;

            activate();

            function activate() {
                $scope.visibleTo = visibleTo($scope.post);
                $scope.source = PostMetadataService.formatSource($scope.post.source);
                $scope.post.user = PostMetadataService.loadUser($scope.post);
                $scope.post.contact = PostMetadataService.loadContact($scope.post);
                PostMetadataService.formatTags($scope.post.tags).then((tags) => {
                    $scope.tags = tags;
                });

                formatDates();
            }

            function formatDates() {
                var postDate = moment($scope.post.post_date),
                    now = moment();

                if (now.isSame(postDate, 'day')) {
                    $scope.displayTime = postDate.fromNow();
                } else if (now.isSame(postDate, 'week') && $scope.hideDateThisWeek) {
                    $scope.displayTime = postDate.format('LT');
                } else {
                    $scope.displayTime = postDate.format('LL');
                }
                $scope.displayTimeFull = postDate.format('LLL');

                $scope.timeago = postDate.from(now);
            }

            function visibleTo(post) {
                if (post.status === 'draft') {
                    return 'draft';
                }

                if (!_.isEmpty(post.published_to)) {
                    return post.published_to.join(', ');
                }

                return 'everyone';
            }
        }
    };
}
