module.exports = [
    '$scope',
    '$rootScope',
    '$translate',
    'FormEndpoint',
    'Notify',
    '_',
function (
    $scope,
    $rootScope,
    $translate,
    FormEndpoint,
    Notify,
    _
) {

    // Change layout class
    $rootScope.setLayout('layout-c');
    // Change mode
    $scope.$emit('event:mode:change', 'settings');

    $scope.fileContainer = {
        file : null
    };

    FormEndpoint.query().$promise.then(function (response) {
        $scope.forms = response;
    });
}];
