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
    CategoriesSdk,
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
            $scope.categories = _.map(_.where(categories, { parent_id: null }));
            $scope.$apply();
        });
        $scope.selectedCategories = [];
    };
    $scope.refreshView();

    $scope.deleteCategory = function (category) {
        Notify.confirmDelete('notify.category.destroy_confirm', 'notify.category.destroy_confirm_desc').then(function () {
            CategoriesSdk.deleteCategory(category.id).then(function () {
                Notify.notify('notify.category.destroy_success', { name: category.tag });
                $scope.refreshView();
            }, handleResponseErrors);
        });
    };

    $scope.deleteCategories = function () {
        Notify.confirmDelete('notify.category.bulk_destroy_confirm', 'notify.category.bulk_destroy_confirm_desc', { count: $scope.selectedCategories.length }).then(function () {
            var calls = [];
            angular.forEach($scope.selectedCategories, function (categoryId) {
                calls.push(CategoriesSdk.deleteCategory(categoryId));
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

    $scope.getLanguages = function (enabled_languages) {
        let languages = [enabled_languages.default, ...enabled_languages.available];
        languages = _.without(languages, '');
        if (languages.length > 0) {
            let languageString = languages.length > 1 ? $translate.instant('translations.languages') : $translate.instant('translations.language');
            _.each(languages,(language, index) => {
                let divider = index !== 0 ? ',' : ':';
                languageString = `${languageString + divider} ${$translate.instant(`languages.${language}`)}`;
        });
            return languageString;
        }
    }
}];
