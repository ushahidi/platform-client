module.exports = [
    '$scope',
    '$translate',
    '$rootScope',
    '$location',
    '$q',
    'CategoriesSdk',
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
        CategoriesSdk.getCategories().then(function (categories) {
            $scope.allCategories = categories;
            $scope.categories = _.map(_.where(categories, { parent_id: null }), function (category) {
                if (category && category.children) {
                    category.children = _.map(category.children, function (child) {
                        return _.findWhere(category, {id: parseInt(child.id)});
                    });
                }
                return category;
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
            angular.forEach($scope.selectedCategories, function (categoryId) {
                calls.push(CategoriesSdk.deleteCategory({id: categoryId }));
            });
            $q.all(calls).then(function () {
                Notify.notify('notify.category.bulk_destroy_success', { count: $scope.selectedCategories.length });
                $scope.refreshView();
            }, handleResponseErrors);
        });
    };

    $scope.isToggled = function (category) {
        return $scope.selectedCategories.indexOf(category.id) > -1;
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
