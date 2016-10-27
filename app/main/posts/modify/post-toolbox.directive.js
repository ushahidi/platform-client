module.exports = PostToolboxDirective;

PostToolboxDirective.$inject = [
    'PostActionsService',
    'PostMetadataService',
    'moment',
    '$rootScope'
];
function PostToolboxDirective(
    PostActionsService,
    PostMetadataService,
    moment,
    $rootScope
) {
    return {
        restrict: 'E',
        scope: {
            post:  '='
        },
        template: require('./post-toolbox.html'),
        link: PostToolboxLink
    };

    function PostToolboxLink($scope) {
        $scope.changeStatus = changeStatus;
        $scope.allowedChangeStatus = allowedChangeStatus;
        $scope.allowedChangeOwner = allowedChangeOwner;
        $scope.editAuthor = editAuthor;
        $scope.showUserRealname = showUserRealname;
        $scope.showAuthorRealname = showAuthorRealname;
        $scope.loadAuthorFormDefaults = loadAuthorFormDefaults;

        activate();

        function activate() {
            $scope.source = PostMetadataService.formatSource($scope.post.source);
            $scope.post.user = PostMetadataService.loadUser($scope.post);
            $scope.statuses = PostActionsService.getStatuses();
            formatDates();
        }

        function changeStatus(status) {
            $scope.post.status = status;
        }

        // TODO: this function should be moved to a general service handling permissions
        function allowedChangeStatus() {
            return $scope.post.allowed_privileges && $scope.post.allowed_privileges.indexOf('change_status') !== -1;
        }

        // FIXME: Enable after allowing change of author in API
        function allowedChangeOwner() {
            return false;
        }

        function editAuthor() {
            $scope.showEditAuthorButton = false;
            $scope.showEditAuthorForm = true;
        }

        function showUserRealname() {
            return !$scope.showEditAuthorForm && !$scope.post.author_realname && $scope.post.user;
        }

        function showAuthorRealname() {
            return !$scope.showEditAuthorForm && $scope.post.author_realname;
        }

        function loadAuthorFormDefaults() {
            if ($scope.post.author_realname || $scope.post.user) {
                $scope.showEditAuthorButton = true;
                $scope.showEditAuthorForm = false;
            } else {
                $scope.showEditAuthorButton = false;
                $scope.showEditAuthorForm = true;
            }
        }

        function formatDates() {
            $scope.displayCreated = moment($scope.post.created).format('LLL');

            if ($scope.post.updated) {
                $scope.displayUpdated = moment($scope.post.updated).format('LLL');
            }
        }
    }
}
