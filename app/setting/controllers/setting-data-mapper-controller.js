module.exports = [
    '$scope',
    '$q',
    '$translate',
    '$routeParams',
    'FormEndpoint',
    'DataImportEndpoint',
    'Notify',
    '_',
function (
    $scope,
    $q,
    $translate,
    $routeParams,
    FormEndpoint,
    DataImportEndpoint,
    Notify,
    _
) {
    $scope.formId = $routeParams.formId;
    $scope.csvId = $routeParams.id;
    
    $q.all([
        FormEndpoint.get({id: $scope.formId}).$promise,
        FormAttributeEndpoint.query({ formId: $scope.formId }).$promise,
        DataImportEndpoint.get({id: $scope.csv}).$promise
    ]).then(function (results) {
        $scope.form = results[0];
        form.attributes = _.chain(results[1])
            .sortBy('priority')
            .value();
        $scope.csv = result[2];
    });
}];
