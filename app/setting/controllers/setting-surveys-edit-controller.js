module.exports = [
    '$scope',
    '$rootScope',
    '$routeParams',
function (
    $scope,
    $rootScope,
    $routeParams
) {

    // Change layout class
    $rootScope.setLayout('layout-a');

    $scope.surveyId = $routeParams.id;

}];
