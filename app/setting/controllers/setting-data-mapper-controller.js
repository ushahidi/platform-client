module.exports = [
    '$scope',
    'initialData',
function (
    $scope,
    initialData
) {
    $scope.form = initialData.form;
    $scope.csv = initialData.csv;
}];
