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

    $scope.csv = DataRetriever.getImportData();
}];
