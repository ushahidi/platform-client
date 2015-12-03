module.exports = [
    '$scope',
    '$routeParams',
    '$q',
    'FormEndpoint',
    'FormStageEndpoint',
function (
    $scope,
    $routeParams,
    $q,
    FormEndpoint,
    FormStageEndpoint
) {

    $scope.formId = $routeParams.id;

    // If we're editing an existing form,
    // load the form info and all the fields.
    $q.all([
        FormEndpoint.get({ id: $scope.formId }).$promise,
        FormStageEndpoint.query({ formId: $scope.formId }).$promise
    ]).then(function (results) {
        var form = results[0];
        form.stages = results[1];
        $scope.form = form;
    });

}];
