module.exports = [
    '$scope',
    '$translate',
    '$q',
    'TagEndpoint',
    'RoleHelper',
function(
    $scope,
    $translate,
    $q,
    TagEndpoint,
    RoleHelper
) {

    $translate('tag.manage_tags').then(function(manageTagsTranslation){
        $scope.title = manageTagsTranslation;
    });

    $scope.getRole = RoleHelper.getRole;

    $scope.refreshView = function() {
        $scope.tags = TagEndpoint.query();
        $scope.selectedTags = [];
    };
    $scope.refreshView();

    $scope.deleteTags = function() {
        $translate('notify.tag.bulk_destroy_confirm', {
            count: $scope.selectedTags.length
        }).then(function(message) {
            if (window.confirm(message)) {
                var calls = [];
                angular.forEach($scope.selectedTags, function(tagId) {
                    calls.push( TagEndpoint.delete({ id: tagId }).$promise );
                });
                $q.all(calls).then($scope.refreshView);
            }
        });
    };

    $scope.isToggled = function(tag) {
        return $scope.selectedTags.indexOf(tag.id) > -1;
    };

    $scope.toggleTag = function(tag) {
        var idx = $scope.selectedTags.indexOf(tag.id);
        if (idx > -1) {
            $scope.selectedTags.splice(idx, 1);
        } else {
            $scope.selectedTags.push(tag.id);
        }
    };

}];
