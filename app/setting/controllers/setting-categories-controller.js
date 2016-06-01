module.exports = [
    '$scope',
    '$translate',
    '$q',
    'TagEndpoint',
    'Notify',
function (
    $scope,
    $translate,
    $q,
    TagEndpoint,
    Notify
) {
    $translate('tool.manage_tags').then(function (title) {
        $scope.title = title;
        $scope.$emit('setPageTitle', title);
    });
    // Change mode
    $scope.$emit('event:mode:change', 'settings');


    $scope.refreshView = function () {
        TagEndpoint.query().$promise.then(function (tags) {
            $scope.categories = tags;
        });
        $scope.selectedCategories = [];
    };
    $scope.refreshView();

    $scope.deleteCategories = function () {
        $translate('notify.tag.bulk_destroy_confirm', {
            count: $scope.selectedCategories.length
        }).then(function (message) {
            Notify.showConfirm(message).then(function () {
                var calls = [];
                angular.forEach($scope.selectedCategories, function (tagId) {
                    calls.push(TagEndpoint.delete({ id: tagId }).$promise);
                });
                $q.all(calls).then(function () {
                    $translate(
                        'notify.tag.bulk_destroy_success',
                        {
                            count: $scope.selectedCategories.length
                        }).then(function (message) {
                        Notify.showNotificationSlider(message);
                    });
                    $scope.refreshView();
                });
            });
        });
    };

    $scope.isToggled = function (tag) {
        return $scope.selectedCategories.indexOf(tag.id) > -1;
    };

    $scope.toggleCategory = function (tag) {
        var idx = $scope.selectedCategories.indexOf(tag.id);
        if (idx > -1) {
            $scope.selectedCategories.splice(idx, 1);
        } else {
            $scope.selectedCategories.push(tag.id);
        }
    };

}];
