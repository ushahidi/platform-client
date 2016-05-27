module.exports = [
    '$scope',
    '$rootScope',
    '$translate',
    '$q',
    'Notify',
    'DataRetriever',
    '_',
function (
    $scope,
    $rootScope,
    $translate,
    $q,
    Notify,
    DataRetriever,
    _
) {

    // Change layout class
    $rootScope.setLayout('layout-c');
    // Change mode
    $scope.$emit('event:mode:change', 'settings');

    $scope.csv = DataRetriever.getImportData();
}];
