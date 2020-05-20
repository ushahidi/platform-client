module.exports = [
    '$scope',
    '$rootScope',
    '$translate',
    '$location',
    'RoleEndpoint',
    'TagEndpoint',
    'CategoriesSdk',
    'Notify',
    '_',
    'Util',
    '$transition$',
    '$q',
    '$state',
function (
    $scope,
    $rootScope,
    $translate,
    $location,
    RoleEndpoint,
    TagEndpoint,
    CategoriesSdk,
    Notify,
    _,
    Util,
    $transition$,
    $q,
    $state
) {

    // Redirect to home if not authorized
    if ($rootScope.hasManageSettingsPermission() === false) {
        return $location.path('/');
    }

    // Set initial category properties and page title
    if ($location.path() === '/settings/categories/create') {
        // Allow parent category selector
        $scope.isParent = false;
        // Translate and set add category page title
        $translate('category.add_tag').then(function (title) {
            $scope.title = title;
            $scope.$emit('setPageTitle', title);
        });
    } else {
        // Translate and set edit category page title
        $translate('category.edit_tag').then(function (title) {
            $scope.title = title;
            $rootScope.$emit('setPageTitle', title);
        });
    }

    // Change mode
    $scope.$emit('event:mode:change', 'settings');

    $scope.deleteCategory = deleteCategory;
    $scope.getParentName = getParentName;
    $scope.saveCategory = saveCategory;

    $scope.cancel = cancel;

    $scope.processing = false;
    $scope.save = $translate.instant('app.save');
    $scope.saving = $translate.instant('app.saving');

    activate();

    function activate() {
        getRoles();
        getCategories();
    }

    function getRoles() {
        RoleEndpoint.query().$promise.then(function (roles) {
            $scope.roles = roles;
        });
    }

    function getCategories() {
        CategoriesSdk.getCategories().then(function (categories) {
            // setting parents for dropdown
            $scope.parents = _.map(_.where(categories, { parent_id: null }));
            // setting category-object we are working on, existing or new
            if ($transition$.params().id) {
                $scope.category = _.filter(categories, {id: parseInt($transition$.params().id)})[0];
            } else {
                $scope.category = {
                    type: 'category',
                    icon: 'tag',
                    color: '',
                    parent_id: null,
                    parent_id_original: null,
                    enabled_languages: {},
                    translations:{}
                };
            }
            //Normalize parent category
            if ($scope.category.parent) {
                $scope.category.parent_id = $scope.category.parent.id;
                $scope.category.parent_id_original = $scope.category.parent.id;
                delete $scope.category.parent;
            }

            if ($scope.category.children && $scope.category.children.length) {
                $scope.isParent = true;
            }
            $scope.$apply();
        });
    }

    function getParentName() {
        var parentName = 'Nothing';
        if ($scope.category && $scope.parents) {
            $scope.parents.forEach(function (parent) {
                if (parent.id === $scope.category.parent_id) {
                    parentName = parent.tag;
                }
            });
        }
        return parentName;
    }

    function saveCategory() {
        // Set processing to disable user actions
        $scope.processing = true;

        //Ensure slug is updated to tag
        $scope.category.slug = $scope.category.tag;

        // If child category with new parent
        if ($scope.category.parent_id && $scope.category.parent_id !== $scope.category.parent_id_original) {
            let parent = _.findWhere($scope.parents, { id: $scope.category.parent_id });
            // apply new permissions to child category
            $scope.category.role = parent.role;
        }

        // Save category
        CategoriesSdk.saveCategory($scope.category)
        .then(function (result) {
            // If parent category, apply parent category permisions to child categories
            if (result.children && result.children.length) {
                return updateChildrenPermissions(result);
            }
        })
        .then(function () {
            // Display success message
            Notify.notify(
                'notify.category.save_success',
                { name: $scope.category.tag }
            );
            // Redirect to categories list
            $state.go('settings.categories', {}, { reload: true });
        })
        // Catch and handle errors
        .catch(handleResponseErrors);
    }

    function updateChildrenPermissions(category) {
        var promises = [];
        _.each(category.children, function (child) {
            child.role = category.role;
            promises.push(
              CategoriesSdk.saveCategory(child));
        });
        return $q.all(promises);
    }

    function deleteCategory(category) {
        Notify.confirmDelete(
            'notify.category.destroy_confirm',
            'notify.category.destroy_confirm_desc'
        ).then(function () {
            return TagEndpoint
            .delete({ id: category.id })
            .$promise
            .then(function () {
                Notify.notify('notify.category.destroy_success');
                $location.url('/settings/categories');
            });
        })
        .catch(handleResponseErrors);
    }

    function handleResponseErrors(errorResponse) {
        $scope.processing = false;
        Notify.apiErrors(errorResponse);
    }

    function cancel() {
        $location.path('/settings/categories');
    }

}];
