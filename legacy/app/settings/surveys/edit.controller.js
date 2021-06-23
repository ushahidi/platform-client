module.exports = [
    '$scope',
    '$rootScope',
    '$transition$',
function (
    $scope,
    $rootScope,
    $transition$
) {
    $scope.surveyId = $transition$.params().id;
    $scope.actionType = $transition$.params().action;
}];
