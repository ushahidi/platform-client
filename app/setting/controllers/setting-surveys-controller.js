module.exports = [
    '$scope',
    '$rootScope',
    '$translate',
    '$location',
    '$q',
    'FormEndpoint',
    'FormStageEndpoint',
    'Notify',
    '_',
function (
    $scope,
    $rootScope,
    $translate,
    $location,
    $q,
    FormEndpoint,
    FormStageEndpoint,
    Notify,
    _
) {

    // Change layout class
    $rootScope.setLayout('layout-b');
    // Redirect to home if not authorized
    if ($rootScope.hasManageSettingsPermission() === false) {
        return $location.path('/');
    }

    $translate('nav.posts_and_entities').then(function (title) {
        $scope.title = title;
        $scope.$emit('setPageTitle', title);
    });
    // Change mode
    $scope.$emit('event:mode:change', 'settings');

    // Get all the forms for display
    $scope.refreshForms = function () {
        FormEndpoint.query().$promise.then(function (response) {
            $scope.forms = response;
        });
    };
    $scope.refreshForms();
}];
