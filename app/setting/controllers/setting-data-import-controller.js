module.exports = [
    '$scope',
    '$translate',
    'FormEndpoint',
    'Notify',
    '_',
function (
    $scope,
    $translate,
    FormEndpoint,
    Notify,
    _
) {
    FormEndpoint.query().then(function (results) {
        $scope.form = results;
    });
});
