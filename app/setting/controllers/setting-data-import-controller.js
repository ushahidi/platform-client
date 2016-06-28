module.exports = [
    '$scope',
    '$rootScope',
    '$location',
    '$translate',
    'FormEndpoint',
    'Notify',
    '_',
function (
    $scope,
    $rootScope,
    $location,
    $translate,
    FormEndpoint,
    Notify,
    _
) {

    // Redirect to home if not authorized
    if ($rootScope.hasManageSettingsPermission() === false) {
        return $location.path('/');
    }

    // Change layout class
    $rootScope.setLayout('layout-c');
    // Change mode
    $scope.$emit('event:mode:change', 'settings');

    $scope.fileContainer = {
        file : null
    };

    FormEndpoint.query().$promise.then(function (response) {
        $scope.forms = response;
    });
}];
