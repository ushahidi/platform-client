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
function (
    $scope,
    $rootScope,
    $routeParams,
    $translate,
    multiTranslate,
    RoleHelper,
    TagEndpoint,
    Notify,
    _
) {
    $translate('tool.manage_tags').then(function (title) {
        $scope.title = title;
        $rootScope.$emit('setPageTitle', title);
    });

    $scope.types = multiTranslate(['tag.types.category', 'tag.types.status']);
    $scope.roles = RoleHelper.roles;

    $scope.tag = TagEndpoint.get({id: $routeParams.id});
    $scope.processing = false;

    $scope.saveTag = function (tag) {
        $scope.processing = true;
        TagEndpoint.update({id: $routeParams.id}, tag, function () {
            $rootScope.goBack();
        }, function (errorResponse) { // error
            var errors = _.pluck(errorResponse.data && errorResponse.data.errors, 'message');
            errors && Notify.showAlerts(errors);
            $scope.processing = false;
        });
    };
}];
