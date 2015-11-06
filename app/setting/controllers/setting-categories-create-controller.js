module.exports = [
    '$scope',
    '$location',
    '$translate',
    'multiTranslate',
    'RoleHelper',
    'TagEndpoint',
    'Notify',
    '_',
function (
    $scope,
    $location,
    $translate,
    multiTranslate,
    RoleHelper,
    TagEndpoint,
    Notify,
    _
) {
    $translate('tag.add_tag').then(function (title) {
        $scope.title = title;
        $scope.$emit('setPageTitle', title);
    });

    $scope.types = multiTranslate(['tag.types.category', 'tag.types.status']);
    $scope.roles = RoleHelper.roles();

    $scope.tag = { type: 'category', icon: 'tag' };
    $scope.processing = false;

    $scope.saveTag = function (tag) {
        $scope.processing = true;
        TagEndpoint.saveCache(tag).$promise.then(function (response) {
            if (response.id) {
                $translate(
                    'notify.tag.save_success',
                    {
                        name: tag.tag
                    }).then(function (message) {
                    Notify.showNotificationSlider(message);
                });
                $location.path('/settings/categories/' + response.id);
            }
        }, function (errorResponse) { // error
            Notify.showApiErrors(errorResponse);
            $scope.processing = false;
        });
    };
}];
