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

    $translate('category.edit_tag').then(function (title) {
        $scope.title = title;
        $rootScope.$emit('setPageTitle', title);
    });

    // Change mode
    $scope.$emit('event:mode:change', 'settings');

    $scope.category = {};

    // getting label to edit
    TagEndpoint.getFresh({id: $routeParams.id}).$promise.then(function (tag) {
        $scope.category = tag;
        // adding parent-object to tag
        if ($scope.category.parent) {
            $scope.category.parent = addParent($scope.category.parent.id);
        }
        //extract form-ids and make them integers
        $scope.category.forms = $scope.category.forms.map(function (form) {
            return parseInt(form.id);
        });
    });

    /* getting the parents should happen on the api-side with its own route.
    Leaving it here until a parent-route is created */
    TagEndpoint.query().$promise.then(function (tags) {
        $scope.parents = getParents(tags);
    });

    FormEndpoint.queryFresh().$promise.then(function (forms) {
        $scope.surveys = forms;
    });

    function addParent(id) {
        return TagEndpoint.getFresh({id: id});
    }
    /* not neccessary after parent filtering is made in the api instead */
    function getParents(tags) {
        var parents = [];
        tags.forEach(function (tag) {
            if (!tag.parent && tag.id !== $scope.category.id) {
                parents.push(tag);
            }
        });
        return parents;
    }

    $scope.getParentName = function () {
        var parentName = 'Nothing';
        if ($scope.category.parent_id) {
            $scope.parents.forEach(function (parent) {
                if (parent.id === $scope.category.parent_id) {
                    parentName = parent.tag;
                }
            });
        } else if ($scope.category.parent) {
            parentName = $scope.category.parent.tag;
        }
        return parentName;
    };

    RoleEndpoint.query().$promise.then(function (roles) {
        $scope.roles = roles;
    });

    $scope.saving = false;

    $scope.saveCategory = function (tag) {
        $scope.saving = true;
        //@todo: change this to use original api allowing callback on save and delete cache
        TagEndpoint.saveCache(tag).$promise.then(function (result) {
            Notify.notify('notify.category.save_success', {name: tag.tag});
            $location.path('/settings/categories');
        }, function (errorResponse) { // error
            Notify.apiErrors(errorResponse);
            $scope.saving = false;
        });
    };

    var handleResponseErrors = function (errorResponse) {
        Notify.apiErrors(errorResponse);
    };

    $scope.deleteCategory = function (category) {
        Notify.confirmDelete('notify.category.destroy_confirm').then(function () {
            TagEndpoint.delete({ id: category.id }).$promise.then(function () {
                Notify.notify('notify.category.destroy_success');
            }, handleResponseErrors);
            $location.url('/settings/categories');
        }, function () {});
    };

    $scope.cancel = function () {
        $location.path('/settings/categories');
    };
}];
