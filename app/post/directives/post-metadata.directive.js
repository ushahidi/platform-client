module.exports = PostMetadataDirective;

PostMetadataDirective.$inject = [
    '$translate',
    'UserEndpoint',
    'ContactEndpoint',
    '_',
    'moment'
];
function PostMetadataDirective(
    $translate,
    UserEndpoint,
    ContactEndpoint,
    _,
    moment
) {
    return {
        restrict: 'E',
        scope: {
            post:  '=',
            // Should we hide the date for posts this week?
            hideDateThisWeek: '@?'
        },
        templateUrl: 'templates/posts/post-metadata.html',
        link: function ($scope) {
            $scope.visibleTo = '';
            $scope.displayTime = '';
            $scope.displayTimeFull = '';
            $scope.hideDateThisWeek = $scope.hideDateThisWeek || false;

            activate();

            function activate() {
                $scope.visibleTo = visibleTo($scope.post);
                $scope.source = formatSource($scope.post.source);
                $scope.post.user = loadUser($scope.post.user);
                $scope.post.contact = loadContact($scope.post.contact);

                formatDates();
            }

            // Format source (fixme!)
            function formatSource(source) {
                if (source === 'sms') {
                    return 'SMS';
                } else if (source) {
                    // Uppercase first character
                    return source.charAt(0).toUpperCase() + source.slice(1);
                } else {
                    return 'Web';
                }
            }

            // Load the post author
            function loadUser(user) {
                if (user && user.id) {
                    return UserEndpoint.get({id: $scope.post.user.id});
                }
            }

            function loadContact(contact) {
                if (!$scope.post.user && contact && contact.id) {
                    return ContactEndpoint.get({ id: $scope.post.contact.id });
                }
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
