module.exports = [
    '$scope',
    '$rootScope',
    '$location',
    '$translate',
    'multiTranslate',
    'RoleHelper',
    'TagEndpoint',
    'Notify',
    '_',
function(
    $scope,
    $rootScope,
    $location,
    $translate,
    multiTranslate,
    RoleHelper,
    TagEndpoint,
    Notify,
    _
) {
    $translate('tag.add_tag').then(function(manageTagsTranslation){
        $scope.title = manageTagsTranslation;
    });

    $scope.types = multiTranslate(['tag.types.category', 'tag.types.status']);
    $scope.roles = RoleHelper.roles;

    $scope.tag = {type: 'category'};
    $scope.processing = false;

    $scope.saveTag = function(tag) {
        $scope.processing = true;
        var response = TagEndpoint.save(tag, function() {
            if (response.id) {
                $location.path('/tools/categories/' + response.id);
            }
        }, function(errorResponse) { // error
            var errors = _.pluck(errorResponse.data && errorResponse.data.errors, 'message');
            errors && Notify.showAlerts(errors);
            $scope.processing = false;
        });
    };
}];
