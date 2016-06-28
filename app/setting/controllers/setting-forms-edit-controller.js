module.exports = [
    '$scope',
    '$routeParams',
    '$rootScope',
    '$location',
    '$q',
    'FormEndpoint',
    'FormStageEndpoint',
function (
    $scope,
    $routeParams,
    $rootScope,
    $location,
    $q,
    FormEndpoint,
    FormStageEndpoint
) {

    // Redirect to home if not authorized
    if ($rootScope.hasManageSettingsPermission() === false) {
        return $location.path('/');
    }
    // Change mode
    $scope.$emit('event:mode:change', 'settings');
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
