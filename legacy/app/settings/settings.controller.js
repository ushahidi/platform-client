module.exports = [
    '$scope',
    '$translate',
    '$location',
    '$rootScope',
function (
    $scope,
    $translate,
    $location,
    $rootScope
) {

    // Redirect to home if not authorized
    if ($rootScope.hasManageSettingsPermission() === false) {
        return $location.path('/');
    }

    $translate('tool.settings').then(function (title) {
        $scope.title = title;
        $scope.$emit('setPageTitle', title);
    });
    // Change mode
    $scope.$emit('event:mode:change', 'settings');
}];
