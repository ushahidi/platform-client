module.exports = [
    '$scope',
    '$rootScope',
    '$stateParams',
function (
    $scope,
    $rootScope,
    $stateParams
) {
    $scope.surveyId = $stateParams.id;
    $scope.actionType = $stateParams.action;
}];
