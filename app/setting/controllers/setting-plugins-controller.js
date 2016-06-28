module.exports = [
    '$scope',
    '$rootScope',
    '$location',
    '$translate',
function (
    $scope,
    $rootScope,
    $location,
    $translate
) {

    // Redirect to home if not authorized
    if ($rootScope.hasManageSettingsPermission() === false) {
        return $location.path('/');
    }

    $translate('tool.manage_plugins').then(function (title) {
        $scope.title = title;
        $rootScope.$emit('setPageTitle', title);
    });
    // Change mode
    $scope.$emit('event:mode:change', 'settings');

}];
