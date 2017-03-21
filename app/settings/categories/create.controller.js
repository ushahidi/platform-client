module.exports = [
    '$scope',
    '$rootScope',
    '$location',
    '$translate',
    '$route',
    'TagEndpoint',
    'FormEndpoint',
    'Notify',
    '_',
function (
    $scope,
    $rootScope,
    $location,
    $translate,
    $route,
    TagEndpoint,
    FormEndpoint,
    Notify,
    _
) {

    // Redirect to home if not authorized
    if ($rootScope.hasManageSettingsPermission() === false) {
        return $location.path('/');
    }

    $translate('category.add_tag').then(function (title) {
        $scope.title = title;
        $scope.$emit('setPageTitle', title);
    });
    // Change mode
    $scope.$emit('event:mode:change', 'settings');

    $scope.getParentName = function () {
        var parentName = 'Nothing';
        if ($scope.category.parent_id) {
            $scope.parents.forEach(function (parent) {
                if (parent.id === $scope.category.parent_id) {
                    parentName = parent.tag;
                }
            });
        }
        return parentName;
    };

    $scope.category = { type: 'category', icon: 'tag', color: '', parent_id: null};
    $scope.processing = false;

    /* this should happen on the api instead. Adding it here just to be able to move on */
    TagEndpoint.query().$promise.then(function (tags) {
        $scope.parents = [];
        tags.forEach(function (tag) {
            if (!tag.parent) {
                $scope.parents.push(tag);
            }
        });
    });
    // getting available surveys
    FormEndpoint.queryFresh().$promise.then(function (result) {
        $scope.surveys = result;
    });

    $scope.saveCategory = function (category, addAnother) {
        $scope.processing = true;
        var whereToNext = 'settings/categories';
        TagEndpoint.saveCache(category).$promise.then(function (response) {
            if (response.id) {
                Notify.notify('notify.category.save_success', { name: category.tag });
                addAnother ? $route.reload() : $location.path(whereToNext);
            }
        }, function (errorResponse) { // error
            Notify.apiErrors(errorResponse);
            $scope.processing = false;
        });
    };

    $scope.cancel = function () {
        $location.path('/settings/categories');
    };
}];
