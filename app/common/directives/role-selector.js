/**
 * Ushahidi Angular Role Selector directive
 * Drop in directive for managing roles addition for users
 * and posts
 */

module.exports = [
function (
) {
    var controller = [
        '$scope',
        '$rootScope',
        '$translate',
        'Notify',
        'RoleEndpoint',
        '_',
        function (
            $scope,
            $rootScope,
            $translate,
            Notify,
            RoleEndpoint,
            _
        ) {
            $scope.status = null;

            // Check if draft, published to specific roles or for everyone
            $scope.refreshStatus = function () {
                if ($scope.post.status === 'draft') {
                   $scope.status = 'draft';
                } else if ($scope.post.status === 'published') {
                    // If post is puslihed but published_to is empty
                    // the post is pusblished for everyone, indicated by ''
                    if (!$scope.post.published_to) {
                        $scope.status = '';
                    } else{
                        $scope.status = null;
                    }
                }
            };

            $scope.refreshStatus();

            RoleEndpoint.query().$promise.then(function (roles) {
                $scope.roles = roles;
            });

            $scope.checkIfAllSelected = function () {
                return ($scope.roles.length === $scope.post.published_to.length);
            };

            $scope.toggleRole = function (role) {
                if ( role === 'draft' || role === '') {
                    $scope.post.published_to = null;
                } else if ($scope.checkIfAllSelected()) {
                    // All check boxes selected, therefore publish to everyone
                    $scope.post.published_to = null;
                }

                $scope.post.status = role === 'draft' ? role : 'published';

                $scope.refreshStatus();
                //$scope.toggleRoleFunc({role: role});
            };

        }];
    return {
        restrict: 'E',
        templateUrl: 'templates/role-selector/role-selector.html',
        scope: {
            post: '=',
            toggleRoleFunc: '&'
        },
        controller: controller
    };
}];
