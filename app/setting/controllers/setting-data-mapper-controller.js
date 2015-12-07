module.exports = [
    '$scope',
    '$q',
    '$translate',
    'FormEndpoint',
    'DataImportEndpoint',
    'Notify',
    '_',
function (
    $scope,
    $q
    $translate,
    FormEndpoint,
    DataImportEndpoint,
    Notify,
    _
) {
    $scope.formId = $routeParams.formId;
    $scope.csvId = $routeParams.id;
    
    $q.all([
        FormEndpoint.get({id: $scope.formId}).$promise,
        DataImportEndpoint.get({id: $scope.csv}).$promise
    ]).then(function (results) {
        $scope.form = results[0];
        $scope.csv = result[1];
    });
}];
