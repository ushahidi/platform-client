module.exports = [
    '$scope',
    '$translate',
    '$rootScope',
    '$location',
function (
    $scope,
    $translate,
    $rootScope,
    $location
) {

    // Redirect to home if not authorized
    if ($rootScope.hasManageSettingsPermission() === false) {
        return $location.path('/');
    }

    $translate('tool.manage_views').then(function (title) {
        $scope.title = title;
        $scope.$emit('setPageTitle', title);
    });
    // Change mode
    $scope.$emit('event:mode:change', 'settings');

}];
