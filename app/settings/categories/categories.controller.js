module.exports = [
    '$scope',
    '$translate',
    '$rootScope',
    '$location',
    '$q',
    'TagEndpoint',
    'Notify',
    '_',
function (
    $scope,
    $translate,
    $rootScope,
    $location,
    $q,
    TagEndpoint,
    Notify,
    _
) {

    // Redirect to home if not authorized
    if ($rootScope.hasManageSettingsPermission() === false) {
        return $location.path('/');
    }

    $translate('tool.manage_tags').then(function (title) {
        $scope.title = title;
        $scope.$emit('setPageTitle', title);
    });
    // Change mode
    $scope.$emit('event:mode:change', 'settings');


    $scope.refreshView = function () {
        TagEndpoint.queryFresh().$promise.then(function (tags) {
            $scope.allCategories = tags;
            $scope.categories = _.map(_.where(tags, { parent_id: null }), function (tag) {
                if (tag && tag.children) {
                    tag.children = _.map(tag.children, function (child) {
                        return _.findWhere(tags, {id: parseInt(child.id)});
                    });
                }
                return tag;
            });
        });
        $scope.selectedCategories = [];
    };
    $scope.refreshView();

    $scope.deleteCategory = function (tag) {
        Notify.confirmDelete('notify.category.destroy_confirm', 'notify.category.destroy_confirm_desc').then(function () {
            TagEndpoint.delete(tag).$promise.then(function () {
                Notify.notify('notify.category.destroy_success', { name: tag.tag });
                $scope.refreshView();
            }, handleResponseErrors);
        });
    };

    $scope.deleteCategories = function () {
        Notify.confirmDelete('notify.category.bulk_destroy_confirm', 'notify.category.bulk_destroy_confirm_desc', { count: $scope.selectedCategories.length }).then(function () {
            var calls = [];
            angular.forEach($scope.selectedCategories, function (tagId) {
                calls.push(TagEndpoint.delete({id: tagId }).$promise);
            });
            $q.all(calls).then(function () {
                Notify.notify('notify.category.bulk_destroy_success', { count: $scope.selectedCategories.length });
                $scope.refreshView();
            }, handleResponseErrors);
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

    function handleResponseErrors(errorResponse) {
        Notify.apiErrors(errorResponse);
    }

}];
