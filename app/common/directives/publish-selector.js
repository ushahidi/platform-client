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

            $scope.canSeeThis = function () {
                if ($scope.post.published_to && $scope.post.published_to.length) {
                    return $scope.post.published_to.join(', ');
                } else if ($scope.post.status === 'draft') {
                    return $translate.instant('post.just_you');
                } else {
                    return $translate.instant('post.everyone');
                }
            };

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

            };

        }];
    return {
        restrict: 'E',
        templateUrl: 'templates/common/publish-selector/publish-selector.html',
        scope: {
            post: '='
        },
        controller: controller
    };
}];
