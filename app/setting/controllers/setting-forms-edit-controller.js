module.exports = [
    '$scope',
    '$routeParams',
function (
    $scope,
    $routeParams
) {
    $scope.formId = $routeParams.id;
}];
