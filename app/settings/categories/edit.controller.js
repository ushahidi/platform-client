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

    RoleEndpoint.query().$promise.then(function (roles) {
        $scope.roles = roles;
    });

    $scope.save = $translate.instant('app.save');
    $scope.saving = $translate.instant('app.saving');
    $scope.processing = false;
    $scope.isParent = false;

    // getting label to edit
    TagEndpoint.getFresh({id: $routeParams.id}).$promise.then(function (tag) {
        $scope.category = tag;
        // Normalize parent:
        if ($scope.category.parent) {
            $scope.category.parent_id = $scope.category.parent.id;
            delete $scope.category.parent;
        }

        if ($scope.category.children && $scope.category.children.length > 0) {
            $scope.isParent = true;
        }
    });

    // getting available parents
    TagEndpoint.queryFresh({level: 'parent'}).$promise.then(function (tags) {
        // Remove current tag to avoid circular reference
        $scope.parents = _.filter(tags, function (tag) {
            return tag.id !== parseInt($routeParams.id);
        });
    });

    $scope.addParent = function (id) {
        return TagEndpoint.getFresh({id: id});
    };

    $scope.getParentName = function () {
        var parentName = 'Nothing';
        var parent = _.findWhere($scope.parents, { id: $scope.category.parent_id });
        if (parent) {
            parentName = parent.tag;
        }
        return parentName;
    };

    $scope.saveCategory = function (tag) {
        $scope.processing = true;
        //@todo: change this to use original api allowing callback on save and delete cache
        TagEndpoint.saveCache(tag).$promise.then(function (result) {
            Notify.notify('notify.category.save_success', {name: tag.tag});
            $location.path('/settings/categories');
        }, function (errorResponse) { // error
            Notify.apiErrors(errorResponse);
            $scope.processing = false;
        });
    };

    var handleResponseErrors = function (errorResponse) {
        Notify.apiErrors(errorResponse);
    };

    $scope.deleteCategory = function (category) {
        Notify.confirmDelete('notify.category.destroy_confirm', 'notify.category.destroy_confirm_desc').then(function () {
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
