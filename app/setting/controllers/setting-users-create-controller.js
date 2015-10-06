module.exports = [
    '$scope',
    '$rootScope',
    '$translate',
    '$location',
    'UserEndpoint',
    'Notify',
    '_',
    'RoleHelper',
    'CacheManager',
function (
    $scope,
    $rootScope,
    $translate,
    $location,
    UserEndpoint,
    Notify,
    _,
    RoleHelper,
    CacheManager
) {
    $translate('user.add_user').then(function (title) {
        $scope.title = title;
        $rootScope.$emit('setPageTitle', title);
    });

    var userCacheKeyTpl = _.template('/users?limit=<%= limit %>&offset=<%= offset %>&role=<%= role %>');

    $scope.user = {};
    $scope.processing = false;

    $scope.saveUser = function (user) {
        $scope.processing = true;
        var response = UserEndpoint.save(user, function () {
            if (response.id) {
                CacheManager.removeCacheGroup('userCache', userCacheKeyTpl({
                        limit: $scope.itemsPerPage,
                        offset: ($scope.currentPage - 1) * $scope.itemsPerPage,
                        role: $scope.filter.role
                    })
                ); 

                $location.path('/settings/users/' + response.id);
            }
        }, function (errorResponse) { // error
            var errors = _.pluck(errorResponse.data && errorResponse.data.errors, 'message');
            errors && Notify.showAlerts(errors);
            $scope.processing = false;
        });
    };

    $scope.roles = RoleHelper.roles(true);
}];
