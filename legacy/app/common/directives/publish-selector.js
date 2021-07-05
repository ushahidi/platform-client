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
            $scope.showRoles = !!$scope.post.published_to.length;

            $scope.canSeeThis = function () {
                if ($scope.post.published_to && $scope.post.published_to.length) {
                    return _.map($scope.post.published_to, function (role) {
                        return $scope.roles[role].display_name;
                    }).join(', ');
                } else if ($scope.post.status === 'draft') {
                    return $translate.instant('post.just_you');
                } else {
                    return $translate.instant('post.everyone');
                }
            };

            RoleEndpoint.query().$promise.then(function (roles) {
                $scope.roles = _.indexBy(roles, 'name');
            });

            $scope.checkIfAllSelected = function () {
                return ($scope.roles.length === $scope.post.published_to.length);
            };

            $scope.toggleRole = function (role) {
                if (role === 'draft' || role === '') {
                    $scope.post.published_to = [];
                    $scope.showRoles = false;
                } else if ($scope.checkIfAllSelected()) {
                    // All check boxes selected, therefore publish to everyone
                    $scope.post.published_to = [];
                    $scope.showRoles = false;
                }

                $scope.post.status = role === 'draft' ? role : 'published';
            };

            $scope.toggleRolesView = function () {
                $scope.showRoles = true;
            };
        }];
    return {
        restrict: 'E',
        template: require('./publish-selector.html'),
        scope: {
            post: '='
        },
        controller: controller
    };
}];
