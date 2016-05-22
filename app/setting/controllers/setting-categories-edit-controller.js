module.exports = [
    '$scope',
    '$rootScope',
    '$translate',
    '$location',
    'multiTranslate',
    'RoleEndpoint',
    'TagEndpoint',
    'Notify',
    '_',
    'Util',
    'category',
function (
    $scope,
    $rootScope,
    $translate,
    $location,
    multiTranslate,
    RoleEndpoint,
    TagEndpoint,
    Notify,
    _,
    Util,
    category
) {
    $scope.category = category;
    $translate('tag.edit_tag').then(function (title) {
        $scope.title = title;
        $rootScope.$emit('setPageTitle', title);
    });

    $scope.types = multiTranslate(['tag.types.category', 'tag.types.status']);
    RoleEndpoint.query().$promise.then(function (roles) {
        $scope.roles = roles;
    });

    $scope.saving = false;

    $scope.saveCategory = function (tag) {
        $scope.saving = true;
        // @todo: change this to use original api allowing callback on save and delete cache
        TagEndpoint.saveCache(tag).$promise.then(function (result) {
            $rootScope.goBack();
            $translate('notify.tag.save_success', {name: tag.tag}).then(function (message) {
                Notify.showNotificationSlider(message);
            });
        }, function (errorResponse) { // error
            Notify.showApiErrors(errorResponse);
            $scope.saving = false;
        });
    };

    $scope.cancel = function () {
        $location.path('/settings/categories');
    };
}];
