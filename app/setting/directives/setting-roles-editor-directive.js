module.exports = [
    '$translate',
    '$location',
    '$routeParams',
    'RoleEndpoint',
    'PermissionEndpoint',
    'Notify',
function (
    $translate,
    $location,
    $routeParams,
    RoleEndpoint,
    PermissionEndpoint,
    Notify
) {
    return {
        restrict: 'A',
        link: function ($scope, $element, $attrs) {

            $translate('role.add_role').then(function (title) {
                $scope.title = title;
                $scope.$emit('setPageTitle', title);
            });


            PermissionEndpoint.query().$promise.then(function (permissions) {
                $scope.permissions = permissions.results;
            });

            $scope.role = RoleEndpoint.getFresh({id: $routeParams.id});

            $scope.saveRole = function (role) {
                $scope.processing = true;
                RoleEndpoint.saveCache(role).$promise.then(function (result) {
                    $rootScope.goBack();
                    $translate('notify.role.save_success', {name: role.role}).then(function (message) {
                        Notify.showNotificationSlider(message);
                    });
                }, function (errorResponse) { // error
                    Notify.showApiErrors(errorResponse);
                    $scope.processing = false;
                });
            };
        }
    };
}];
