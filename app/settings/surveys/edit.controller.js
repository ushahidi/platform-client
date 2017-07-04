module.exports = [
    '$scope',
    '$rootScope',
    '$routeParams',
function (
    $scope,
    $rootScope,
    $routeParams
) {
    $scope.surveyId = $routeParams.id;
    $scope.actionType = $routeParams.action;
}];
