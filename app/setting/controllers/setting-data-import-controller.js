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
    $scope.fileContainer = {
        file : null
    };

    FormEndpoint.query().$promise.then(function (response) {
        $scope.forms = response;
    });
}];
