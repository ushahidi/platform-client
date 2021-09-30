module.exports = PostMetadataDirective;

PostMetadataDirective.$inject = [
    '$translate',
    '_',
    'dayjs',
    'relativeTime',
    'localizedFormat',
    'PostMetadataService'
];
function PostMetadataDirective(
    $translate,
    _,
    dayjs,
    relativeTime,
    localizedFormat,
    PostMetadataService
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
            $scope.visibleTo = '';
            $scope.displayTime = '';
            $scope.displayTimeFull = '';
            $scope.timeago = '';
            $scope.hideDateThisWeek = $scope.hideDateThisWeek || false;

            $scope.$watch('post.id', function (postId, oldPostId) {
                if (postId !== oldPostId) {
                    activate();
                }
            });

            activate();

            function activate() {
                $scope.visibleTo = visibleTo($scope.post);
                $scope.source = PostMetadataService.formatSource($scope.post.source);
                $scope.post.user = PostMetadataService.loadUser($scope.post);
                $scope.post.contact = PostMetadataService.loadContact($scope.post);

                formatDates();
            }

            function formatDates() {
                dayjs.extend(relativeTime);
                dayjs.extend(localizedFormat);

                let postDate = dayjs($scope.post.post_date),
                    now = dayjs();

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
