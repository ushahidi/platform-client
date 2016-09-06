module.exports = PostMetadataDirective;

PostMetadataDirective.$inject = [
    '$translate',
    '_',
    'moment',
    'PostMetadataService'
];
function PostMetadataDirective(
    $translate,
    _,
    moment,
    PostMetadataService
) {
    return {
        restrict: 'E',
        scope: {
            post:  '=',
            // Should we hide the date for posts this week?
            hideDateThisWeek: '@?'
        },
        templateUrl: 'templates/main/posts/common/post-metadata.html',
        link: function ($scope) {
            //console.log($scope.post);
            $scope.visibleTo = '';
            $scope.displayTime = '';
            $scope.displayTimeFull = '';
            $scope.hideDateThisWeek = $scope.hideDateThisWeek || false;

            activate();

            function activate() {
                $scope.visibleTo = visibleTo($scope.post);
                $scope.source = PostMetadataService.formatSource($scope.post.source);
                $scope.post.user = PostMetadataService.loadUser($scope.post);
                $scope.post.contact = PostMetadataService.loadContact($scope.post);

                formatDates();
            }

            function formatDates() {
                var created = moment($scope.post.created),
                    now = moment();

                if (now.isSame(created, 'day')) {
                    $scope.displayTime = created.fromNow();
                } else if (now.isSame(created, 'week') && $scope.hideDateThisWeek) {
                    $scope.displayTime = created.format('LT');
                } else {
                    $scope.displayTime = created.format('LL');
                }
                $scope.displayTimeFull = created.format('LLL');
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
