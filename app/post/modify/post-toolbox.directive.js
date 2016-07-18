module.exports = PostToolboxDirective;

PostToolboxDirective.$inject = [
    'PostStatusService',
    'PostMetadataService',
    'moment',
    '$rootScope'
];
function PostToolboxDirective(
    PostStatusService,
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
            $scope.showEditAuthorButton = true;
            $scope.showEditAuthorForm = false;

            $scope.source = PostMetadataService.formatSource($scope.post.source);
            $scope.post.user = PostMetadataService.loadUser($scope.post);

            $scope.statuses = PostStatusService.getStatuses();

            formatDates();

            $scope.changeStatus = function (status) {
                $scope.post.status = status;
            };

            $scope.editAuthor = function () {
                $scope.showEditAuthorButton = false;
                $scope.showEditAuthorForm = true;
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

            function formatDates() {
                $scope.displayCreated = moment($scope.post.created).format('LT MMMM D, YYYY');

                if ($scope.post.updated) {
                    $scope.displayUpdated = moment($scope.post.updated).format('LT MMMM D, YYYY');
                }
            }
        }
    };
}
