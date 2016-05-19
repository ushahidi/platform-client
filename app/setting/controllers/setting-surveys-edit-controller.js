module.exports = [
    '$scope',
    '$rootScope',
    '$routeParams',
    '$q',
    'FormEndpoint',
    'FormStageEndpoint',
    'RoleEndpoint',
function (
    $scope,
    $rootScope,
    $routeParams,
    $q,
    FormEndpoint,
    FormStageEndpoint,
    RoleEndpoint
) {

    // Change layout class
    $rootScope.setLayout('layout-a');

    $scope.surveyId = $routeParams.id;

    // If we're editing an existing survey,
    // load the survey info and all the fields.
    $q.all([
        FormEndpoint.get({ id: $scope.surveyId }).$promise,
        FormStageEndpoint.query({ surveyId: $scope.surveyId }).$promise
    ]).then(function (results) {
        var survey = results[0];
        survey.stages = results[1];
        $scope.survey = survey;
    });

    RoleEndpoint.query().$promise.then(function (roles) {
        $scope.roles = roles;
    });

}];
