module.exports = [
    '$scope',
    '$translate',
    '$q',
    'TagEndpoint',
    'RoleHelper',
    'Notify',
function (
    $scope,
    $translate,
    $q,
    TagEndpoint,
    RoleHelper,
    Notify
) {
    $translate('tool.manage_tags').then(function (title) {
        $scope.title = title;
        $scope.$emit('setPageTitle', title);
    });

    $scope.getRole = RoleHelper.getRole;

    $scope.refreshView = function () {
        $scope.tags = TagEndpoint.query();
        $scope.selectedTags = [];
    };
    $scope.refreshView();

    $scope.deleteTags = function () {
        $translate('notify.tag.bulk_destroy_confirm', {
            count: $scope.selectedTags.length
        }).then(function (message) {
            Notify.showConfirm(message).then(function () {
                var calls = [];
                angular.forEach($scope.selectedTags, function (tagId) {
                    calls.push(TagEndpoint.delete({ id: tagId }).$promise);
                });
                $q.all(calls).then(function () {
                    // Note(Will): reloading the entire list seems very heavy
                    // it might be better to prune the list instead or load
                    // the entities differently - as individual objects
                    // rather than a grouped query
                    $scope.refreshView();
                });
                $q.all(calls).then(function () {
                    $translate(
                        'notify.tag.bulk_destroy_success',
                        {
                            count: $scope.selectedTags.length
                        }).then(function (message) {
                        Notify.showNotificationSlider(message);
                    });
                    $scope.refreshView();
                });
            });
        });
    };

    $scope.isToggled = function (tag) {
        return $scope.selectedTags.indexOf(tag.id) > -1;
    };

    $scope.toggleTag = function (tag) {
        var idx = $scope.selectedTags.indexOf(tag.id);
        if (idx > -1) {
            $scope.selectedTags.splice(idx, 1);
        } else {
            $scope.selectedTags.push(tag.id);
        }
    };

}];
