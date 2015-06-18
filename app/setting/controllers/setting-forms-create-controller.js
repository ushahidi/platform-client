module.exports = [
    '$scope',
    '$q',
    'FormEndpoint',
    'FormAttributeEndpoint',
    '_',
function (
    $scope,
    $q,
    FormEndpoint,
    FormAttributeEndpoint,
    _
) {

    // Get all the forms for display
    FormEndpoint.get().$promise.then(function (response) {
        var forms = response.results;

        // Get all form attributes for each form
        var attribute_promises = [];
        _.each(forms, function (form) {
            attribute_promises.push(
                FormAttributeEndpoint.query({ formId: form.id }).$promise
            );
        });

        $q.all(attribute_promises).then(function (data) {
            _.each(data, function (datum, idx) {
                forms[idx].attributes = [].concat(data[idx]);
            });
            $scope.forms = forms;
        });
    });

}];
