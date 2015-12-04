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
    FormEndpoint.get().$promise.then(function (response) {
        $scope.fileContainer = {
            file : null
        };

        $scope.forms = response.results;
    });
}];
