module.exports = [
    '$scope',
    '$rootScope',
    '$translate',
    '$location',
    'RoleEndpoint',
    'TagEndpoint',
    'FormEndpoint',
    'Notify',
    '_',
    'Util',
    '$routeParams',
    '$q',
function (
    $scope,
    $rootScope,
    $translate,
    $location,
    RoleEndpoint,
    TagEndpoint,
    FormEndpoint,
    Notify,
    _,
    Util,
    $routeParams,
    $q
) {

    // Redirect to home if not authorized
    if ($rootScope.hasManageSettingsPermission() === false) {
        return $location.path('/');
    }

    // Set initial category properties and page title
    if ($location.path() === '/settings/categories/create') {
        // Set initial category properties
        $scope.category = {
            type: 'category',
            icon: 'tag',
            color: '',
            parent_id: null
        };
        // Allow parent category selector
        $scope.isParent = false;
        // Translate and set add category page title
        $translate('category.add_tag').then(function (title) {
            $scope.title = title;
            $scope.$emit('setPageTitle', title);
        });
    } else {
        // Get and set initial category properties
        getCategory();
        // Translate and set edit category page title
        $translate('category.edit_tag').then(function (title) {
            $scope.title = title;
            $rootScope.$emit('setPageTitle', title);
        });
    }

    // Change mode
    $scope.$emit('event:mode:change', 'settings');

    $scope.addParent = addParent;
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
        getParentCategories();
    }

    function getRoles() {
        RoleEndpoint.query().$promise.then(function (roles) {
            $scope.roles = roles;
        });
    }

    function getParentCategories() {
        TagEndpoint.queryFresh({ level: 'parent' }).$promise.then(function (tags) {
            // Remove current tag to avoid circular reference
            $scope.parents = _.filter(tags, function (tag) {
                return tag.id !== parseInt($routeParams.id);
            });
        });
    }

    function getCategory() {
        TagEndpoint.getFresh({ id: $routeParams.id }).$promise.then(function (tag) {
            $scope.category = tag;
            // Normalize parent category
            if ($scope.category.parent) {
                $scope.category.parent_id = $scope.category.parent.id;
                $scope.category.parent_id_original = $scope.category.parent.id;
                delete $scope.category.parent;
            }
            if (!$scope.category.parent_id) {
                $scope.isParent = true;
            }
        });
    }

    function addParent(id) {
        return TagEndpoint.getFresh({id: id});
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

    function saveCategory(category) {
        // Set processing to disable user actions
        $scope.processing = true;
        // Save category
        $q.when(
            TagEndpoint
            .saveCache(category)
            .$promise
        )
        .then(function (result) {
            // If parent category, apply parent category permisions to child categories
            if (result.children && result.children.length) {
                return updateChildrenPermissions(result);
            }
            // If child category with new parent, apply new permissions to child category
            if (result.parent && result.parent.id !== $scope.category.parent_id_original) {
                return updateWithParentPermissions(result);
            }
        })
        .then(function () {
            // Display success message
            Notify.notify(
                'notify.category.save_success',
                { name: $scope.category.tag }
            );
            // Redirect to categories list
            $location.path('/settings/categories');
        })
        // Catch and handle errors
        .catch(handleResponseErrors);
    }

    function updateChildrenPermissions(category) {
        var promises = [];
        _.each(category.children, function (child) {
            promises.push(
              TagEndpoint
              .saveCache({ id: child.id, role: category.role })
              .$promise
            );
        });
        return $q.all(promises);
    }

    function updateWithParentPermissions(category) {
        return TagEndpoint
        .getFresh({ id: category.parent.id })
        .$promise
        .then(function (parent) {
            return TagEndpoint
            .saveCache({ id: category.id, role: parent.role })
            .$promise;
        });
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
