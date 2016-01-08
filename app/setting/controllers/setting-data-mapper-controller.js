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
    'Util',
function (
    $scope,
    $q,
    $translate,
    $routeParams,
    FormEndpoint,
    FormAttributeEndpoint,
    DataImportEndpoint,
    Notify,
    _,
    Util
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

        // Add in the Post specific mappable fields
        $scope.form.attributes.push(
            {
                'key': 'title',
                'label': 'title'
            }
        );
        $scope.csv = results[2];
        $scope.csv.maps_to = Util.autoMap(
                                 $scope.csv.columns,
                                 $scope.form.attributes,
                                 $scope.csv.columns.length
                             );
    });
}];
