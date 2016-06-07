module.exports = [
    '$scope',
    '$location',
    '$translate',
    '$route',
    'multiTranslate',
    'RoleEndpoint',
    'TagEndpoint',
    'Notify',
    '_',
function (
    $scope,
    $location,
    $translate,
    $route,
    multiTranslate,
    RoleEndpoint,
    TagEndpoint,
    Notify,
    _
) {
    $translate('tag.add_tag').then(function (title) {
        $scope.title = title;
        $scope.$emit('setPageTitle', title);
    });
    // Change mode
    $scope.$emit('event:mode:change', 'settings');

    $scope.types = multiTranslate(['tag.types.category', 'tag.types.status']);
    RoleEndpoint.query().$promise.then(function (roles) {
        $scope.roles = roles;
    });

    $scope.category = { type: 'category', icon: 'tag', color: ''};
    $scope.processing = false;

    $scope.saveCategory = function (category, addAnother) {
        $scope.processing = true;
        var whereToNext = 'settings/categories';

        TagEndpoint.saveCache(category).$promise.then(function (response) {
            if (response.id) {
                $translate(
                    'notify.tag.save_success',
                    {
                        name: category.tag
                    }).then(function (message) {
                    Notify.showNotificationSlider(message);
                });
                addAnother ? $route.reload() : $location.path(whereToNext);
            }
        }, function (errorResponse) { // error
            Notify.showApiErrors(errorResponse);
            $scope.processing = false;
        });
    };

    $scope.cancel = function () {
        $location.path('/settings/categories');
    };
}];
