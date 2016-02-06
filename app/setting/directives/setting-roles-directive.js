module.exports = [
    '$translate',
    '$location',
    'RoleEndpoint',
    'Notify',
function (
    $translate,
    $location,
    RoleEndpoint,
    Notify
) {
    return {
        restrict: 'A',
        link: function ($scope, $element, $attrs) {
            handleResponseErrors = function (errorResponse) {
                Notify.showApiErrors(errorResponse);
            };
        
            $scope.refreshView = function () {
                $scope.roles = RoleEndpoint.query();
                $scope.selectedRoles = [];
            };
            
            $scope.refreshView();
           
            $scope.selectedRoles = [];

            $scope.deleteRoles = function () {
                $translate('notify.role.bulk_destroy_confirm', {
                    count: $scope.selectedRoles.length
                }).then(function (message) {
                    Notify.showConfirm(message).then(function () {
                        var calls = [];
                        angular.forEach($scope.selectedRoles, function (roleId) {
                            calls.push(RoleEndpoint.delete({ id: roleId }).$promise);
                        });

                        $q.all(calls).then(function () {
                            $translate('notify.user.bulk_destroy_success').then(function (message) {
                                Notify.showNotificationSlider(message);
                            });

                            $scope.refreshView();
                        }, handleResponseErrors);
                    }, function () {});
                });
            };

            $scope.isToggled = function (role) {
                return $scope.selectedRoles.indexOf(role.id) > -1;
            };

            $scope.toggleRole = function (role) {
                var idx = $scope.selectedRoles.indexOf(role.id);
                if (idx > -1) {
                    $scope.selectedRoles.splice(idx, 1);
                } else {
                    $scope.selectedRoles.push(role.id);
                }
            };
        }
    };
}];
