module.exports = [
    '$translate',
    '$location',
    'RoleEndpoint',
    'Notify',
    'Config',
    '_',
function (
    $translate,
    $location,
    RoleEndpoint,
    Notify,
    Config,
    _
) {
    return {
        restrict: 'A',
        link: function ($scope, $element, $attrs) {
            var handleResponseErrors = function (errorResponse) {
                Notify.showApiErrors(errorResponse);
            };

            $scope.refreshView = function () {
                RoleEndpoint.queryFresh().$promise.then(function (roles) {
                    $scope.roles = roles;
                });
            };

            $scope.refreshView();

            $scope.rolesEnabled = Config.features.roles.enabled ? true : false;

            $scope.checkIfLastAdmin = function () {
                var admins = 0;
                _.each($scope.roles, function (role) {
                    if (role.name === 'admin') {
                        admins++;
                    }
                });

                return admins === 1;
            };

            $scope.deleteRole = function (role) {
                if (role.name === 'admin' && $scope.checkIfLastAdmin()) {
                    $translate('notify.role.last_admin')
                    .then(function (message) {
                        Notify.showSingleAlert(message);
                    });
                    return;

                }

                $translate('notify.role.delete_question', {
                    role: role.display_name
                }).then(function (message) {
                    Notify.showConfirm(message).then(function () {
                        RoleEndpoint.delete({ id: role.id }).$promise.then(function () {
                            $translate('notify.role.destroy_success', {
                                role: role.display_name
                            }).then(function (message) {
                                Notify.showNotificationSlider(message);
                            });
                            $scope.refreshView();
                        }, handleResponseErrors);
                    }, function () {});
                });
            };
        }
    };
}];
