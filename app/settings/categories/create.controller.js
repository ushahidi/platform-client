module.exports = [
    '$scope',
    '$rootScope',
    '$location',
    '$translate',
    '$route',
    'TagEndpoint',
    'Notify',
    '_',
function (
    $scope,
    $rootScope,
    $location,
    $translate,
    $route,
    TagEndpoint,
    Notify,
    _
) {

    // Redirect to home if not authorized
    if ($rootScope.hasManageSettingsPermission() === false) {
        return $location.path('/');
    }

    $translate('tag.add_tag').then(function (title) {
        $scope.title = title;
        $scope.$emit('setPageTitle', title);
    });
    // Change mode
    $scope.$emit('event:mode:change', 'settings');

    $scope.category = { type: 'category', icon: 'tag', color: ''};
    $scope.processing = false;

    $scope.saveCategory = function (category, addAnother) {
        $scope.processing = true;
        var whereToNext = 'settings/categories';

        TagEndpoint.saveCache(category).$promise.then(function (response) {
            if (response.id) {
                Notify.notify('notify.category.save_success', { name: category.tag });
                addAnother ? $route.reload() : $location.path(whereToNext);
            }
        }, function (errorResponse) { // error
            Notify.apiErrors(errorResponse);
            $scope.processing = false;
        });
    };

    $scope.cancel = function () {
        $location.path('/settings/categories');
    };
}];
