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

            RoleEndpoint.query().$promise.then(function (roles) {
                $scope.roles = roles;
            });

            $scope.checkIfAllSelected = function () {
                return ($scope.roles.length === $scope.post.published_to.length);
            };

            $scope.toggleRole = function (role) {
                if (role === 'draft' || role === '') {
                    $scope.post.published_to = [];
                } else if ($scope.checkIfAllSelected()) {
                    // All check boxes selected, therefore publish to everyone
                    $scope.post.published_to = [];
                }

                $scope.post.status = role === 'draft' ? role : 'published';

                $scope.toggleRoleFunc({updatedPost: $scope.post});
            };

        }];
    return {
        restrict: 'E',
        templateUrl: 'templates/common/publish-selector/publish-selector.html',
        scope: {
            post: '=',
            toggleRoleFunc: '&'
        },
        controller: controller
    };
}];
