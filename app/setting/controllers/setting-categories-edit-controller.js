module.exports = [
    '$scope',
    '$rootScope',
    '$routeParams',
    '$translate',
    'multiTranslate',
    'RoleHelper',
    'TagEndpoint',
    'Notify',
    '_',
    'Util',
function (
    $scope,
    $rootScope,
    $routeParams,
    $translate,
    multiTranslate,
    RoleHelper,
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
    $scope.roles = RoleHelper.roles();

    $scope.tag = TagEndpoint.getFresh({id: $routeParams.id});
    $scope.processing = false;

    $scope.saveTag = function (tag) {
        $scope.processing = true;
        // @todo: change this to use original api allowing callback on save and delete cache
        TagEndpoint.saveCache(tag).$promise.then(function (result) {
            $rootScope.goBack();
            $translate('notify.tag.save_success', {name: tag.tag}).then(function (message) {
                Notify.showNotificationSlider(message);
            });
        }, function (errorResponse) { // error
            Notify.showApiErrors(errorResponse);
            $scope.processing = false;
        });
    };
}];
