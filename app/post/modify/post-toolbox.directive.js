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
        templateUrl: 'templates/posts/modify/post-toolbox.html',
        link: function ($scope) {
            $scope.source = PostMetadataService.formatSource($scope.post.source);
            $scope.post.user = PostMetadataService.loadUser($scope.post);


            $scope.statuses = PostActionsService.getStatuses();
            formatDates();

            $scope.changeStatus = function (status) {
                $scope.post.status = status;
            };

            // TODO: this function should be moved to a general service handling permissions
            $scope.allowedChangeStatus = function () {
                return $scope.post.allowed_privileges && $scope.post.allowed_privileges.indexOf('change_status') !== -1;
            };

            $scope.allowedChangeOwner = function () {
                return $rootScope.hasPermission('Manage Posts');
            };

            $scope.allowedChangeTimestamp = function () {
                return $rootScope.hasPermission('Manage Posts');
            };

            $scope.editAuthor = function () {
                $scope.showEditAuthorButton = false;
                $scope.showEditAuthorForm = true;
            };

            $scope.showUserRealname = function () {
                return !$scope.showEditAuthorForm && !$scope.post.author_realname && $scope.post.user;
            };

            $scope.showAuthorRealname = function () {
                return !$scope.showEditAuthorForm && $scope.post.author_realname;
            };

            $scope.loadAuthorFormDefaults = function () {
                if ($scope.post.author_realname || $scope.post.user) {
                    $scope.showEditAuthorButton = true;
                    $scope.showEditAuthorForm = false;
                } else {
                    $scope.showEditAuthorButton = false;
                    $scope.showEditAuthorForm = true;
                }
            };

            function formatDates() {
                $scope.displayCreated = moment($scope.post.created).format('LT MMMM D, YYYY');

                if ($scope.post.updated) {
                    $scope.displayUpdated = moment($scope.post.updated).format('LT MMMM D, YYYY');
                }
            }
        }
    };
}
