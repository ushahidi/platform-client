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

    $scope.formId = $routeParams.formId;
    $scope.stageId = $routeParams.id;

    // If we're editing an existing form,
    // load the form info and all the fields.
    $q.all([
        FormEndpoint.get({ id: $scope.formId }).$promise,
        FormStageEndpoint.get({ formId: $scope.formId, id: $scope.stageId }).$promise
    ]).then(function (results) {
        $scope.form = results[0];
        $scope.stage = results[1];
    });

}];
