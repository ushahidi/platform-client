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

    /*
     * This function returns a map of csv columns to post_type fields.
     * It checks for the presences of the columns names in the set of attribute labels.
     * If the column is not present the entry is set to undefined.
     *
     * The match is case insensistive.
     */
    $scope.autoMap = function (columns, attributes, mapSize) {
        // Get set of labels
        var attributeLabels = _.map(attributes, function (attribute) {
            return attribute.label.toLowerCase();
        });

        // Create map of labels to attributes
        var attributeMap = _.object(attributeLabels, attributes);

        // Check if a column name appears in the set of labels, if it does set a mapping
        // to the attribute, otherwise set the mapping to undefined.
        return _.map(columns, function (item, index) {
            return _.contains(attributeLabels, item.toLowerCase()) ? attributeMap[item] : undefined;
        });
    };

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
        $scope.csv.maps_to = $scope.autoMap(
                                 $scope.csv.columns,
                                 $scope.form.attributes,
                                 $scope.csv.columns.length
                             );
    });
}];
