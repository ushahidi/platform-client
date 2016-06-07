module.exports = [
    '$scope',
    '$rootScope',
    '$location',
    '$translate',
    '$q',
    'Notify',
    'DataRetriever',
    '_',
function (
    $scope,
    $rootScope,
    $location,
    $translate,
    $q,
    Notify,
    DataRetriever,
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

    $scope.csv = DataRetriever.getImportData();
}];
