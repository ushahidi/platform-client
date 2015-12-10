module.exports = [
    '$scope',
    '$q',
    '$translate',
    '$routeParams',
    'FormEndpoint',
    'FormAttributeEndpoint',
    'DataImportEndpoint',
    'Notify',
    '_',
function (
    $scope,
    $q,
    $translate,
    $routeParams,
    FormEndpoint,
    FormAttributeEndpoint,
    DataImportEndpoint,
    Notify,
    _
) {
    $scope.formId = $routeParams.formId;
    $scope.csvId = $routeParams.id;
    
    $q.all([
        FormEndpoint.get({id: $scope.formId}).$promise,
        FormAttributeEndpoint.query({ formId: $scope.formId }).$promise,
        DataImportEndpoint.get({id: $scope.csvId}).$promise
    ]).then(function (results) {
        $scope.form = results[0];
        $scope.form.attributes = _.chain(results[1])
            .sortBy('priority')
            .value();
        $scope.csv = results[2];
        $scope.csv.maps_to = Array.apply(null, Array($scope.csv.columns.length));
    });
}];
