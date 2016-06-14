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
    'Features',
function (
    $scope,
    $rootScope,
    $translate,
    $location,
    $q,
    FormEndpoint,
    FormStageEndpoint,
    Notify,
    _,
    Features
) {

    // Change layout class
    $rootScope.setLayout('layout-b');
    // Redirect to home if not authorized
    if ($rootScope.hasManageSettingsPermission() === false) {
        return $location.path('/');
    }

    Features.loadFeatures().then(function () {
        $scope.formQuota = Features.getLimit('forms');
    });

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
