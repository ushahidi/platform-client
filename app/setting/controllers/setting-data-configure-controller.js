module.exports = [
    '$scope',
    '$translate',
    '$q',
    'Notify',
    'DataRetriever',
    '_',
function (
    $scope,
    $translate,
    $q,
    Notify,
    DataRetriever,
    _
) {
    $scope.csv = DataRetriever.getImportData();
}];
