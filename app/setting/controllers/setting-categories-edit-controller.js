module.exports = [
    '$scope',
    '$rootScope',
    '$routeParams',
    '$translate',
    '$location',
    'multiTranslate',
    'RoleEndpoint',
    'TagEndpoint',
    'Notify',
    '_',
    'Util',
function (
    $scope,
    $rootScope,
    $routeParams,
    $translate,
    $location,
    multiTranslate,
    RoleEndpoint,
    TagEndpoint,
    Notify,
    _,
    Util
) {
    $translate('tag.edit_tag').then(function (title) {
        $scope.title = title;
        $rootScope.$emit('setPageTitle', title);
    });

    $scope.types = multiTranslate(['tag.types.category', 'tag.types.status']);
    RoleEndpoint.query().$promise.then(function (roles) {
        $scope.roles = roles;
    });

    TagEndpoint.getFresh({id: $routeParams.id}).$promise.then(function (category) {
        $scope.category = category;
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
