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
                        }, handleResponseErrors);
                    }, function () {});
                });
            };
        }
    };
}];
