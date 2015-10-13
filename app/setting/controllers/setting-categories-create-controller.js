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
        TagEndpoint.saveCache(tag).$promise.then(function (result) {
            if (result.id) {
                $location.path('/settings/categories/' + result.id);
            }
        }, function (errorResponse) { // error
            var errors = _.pluck(errorResponse.data && errorResponse.data.errors, 'message');
            errors && Notify.showAlerts(errors);
            $scope.processing = false;
        });
    };
}];
