module.exports = [
    '$scope',
    '$routeParams',
function (
    $scope,
    $routeParams
) {

    $scope.form_template = $routeParams.id;

}];
