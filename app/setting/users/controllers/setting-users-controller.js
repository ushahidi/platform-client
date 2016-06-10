module.exports = [
    '$scope',
    '$rootScope',
    '$translate',
    '$q',
    '$location',
    '_',
    '$window',
    'Session',
    'UserEndpoint',
    'RoleEndpoint',
    'Notify',
function (
    $scope,
    $rootScope,
    $translate,
    $q,
    $location,
    _,
    $window,
    Session,
    UserEndpoint,
    RoleEndpoint,
    Notify
) {

    // Redirect to home if not authorized
    if ($rootScope.hasManageSettingsPermission() === false) {
        return $location.path('/');
    }

    var handleResponseErrors, checkAndNotifyAboutManipulateOwnUser;
    $rootScope.setLayout('layout-a');
    $translate('tool.manage_users').then(function (title) {
        $scope.title = title;
        $scope.$emit('setPageTitle', title);
    });

    RoleEndpoint.query().$promise.then(function (roles) {
        $scope.roles = _.indexBy(roles, 'name');
    });

    $scope.filters = {
        role: [],
        q: ''
    };

    $scope.selectedUsers = [];

    $scope.isToggled = function (user) {
        return $scope.selectedUsers.indexOf(user.id) > -1;
    };

    $scope.toggleUser = function (user) {
        var idx = $scope.selectedUsers.indexOf(user.id);
        if (idx > -1) {
            $scope.selectedUsers.splice(idx, 1);
        } else {
            $scope.selectedUsers.push(user.id);
        }
    };

    handleResponseErrors = function (errorResponse) {
        Notify.apiErrors(errorResponse);
    };

    checkAndNotifyAboutManipulateOwnUser = function (translationKey) {
        var currentUserId = Session.getSessionDataEntry('userId');
        if (_.contains($scope.selectedUsers, currentUserId)) {
            Notify.error(translationKey);
            return true;
        }
        return false;
    };

    $scope.addUser = function () {
        $location.path('/settings/users/create');
    };

    $scope.deleteUsers = function () {

        if (checkAndNotifyAboutManipulateOwnUser('user.cannot_delete_yourself')) {
            return;
        }
        Notify.confirmDelete('notify.user.bulk_destroy_confirm', {
            count: $scope.selectedUsers.length
        }).then(function () {
            var calls = [];
            angular.forEach($scope.selectedUsers, function (userId) {
                calls.push(UserEndpoint.delete({ id: userId }).$promise);
            });

            $q.all(calls).then(function () {
                Notify.notify('notify.user.bulk_destroy_success');
                $scope.getUsersForPagination();
            }, handleResponseErrors)
            .finally($scope.filterRole);
        }, function () {});
    };

    $scope.changeRole = function (role) {
        if (checkAndNotifyAboutManipulateOwnUser('user.cannot_change_your_own_role')) {
            return;
        }

        Notify.confirm('notify.user.bulk_role_change_confirm', {
            count: $scope.selectedUsers.length,
            role:  role.display_name
        }).then(function () {
            var calls = [];
            angular.forEach($scope.selectedUsers, function (userId) {
                calls.push(UserEndpoint.saveCache({ id: userId, role: role.name }).$promise);
            });
            $q.all(calls).then(function () {
                Notify.notify('notify.user.bulk_role_change_success', {role_name: role.name});
                $scope.getUsersForPagination();
            }, handleResponseErrors)
            .finally($scope.filterRole);
        });
    };

    $scope.itemsPerPageChanged = function (count) {
        $scope.itemsPerPage = count;
        $scope.getUsersForPagination();
    };

    // // hydrate!
    // $scope.users = UserEndpoint.query();


    // --- start: definitions
    $scope.getUsersForPagination = function () {
        var filters = _.extend({
                            offset: ($scope.currentPage - 1) * $scope.itemsPerPage,
                            limit: $scope.itemsPerPage,
                            orderby: 'realname'
                        }, $scope.filters);
        UserEndpoint.queryFresh(filters).$promise.then(function (usersResponse) {
            $scope.users = usersResponse.results;
            $scope.totalItems = usersResponse.total_count;
        });
    };

    $scope.pageChanged = $scope.getUsersForPagination;
    $scope.applyFilters = function () {
        $scope.getUsersForPagination();
    };
    // --- end: definitions


    // --- start: initialization
    $scope.filteredRole = '';
    $scope.currentPage = 1;
    $scope.itemsPerPageOptions = [10, 20, 50];
    $scope.itemsPerPage = $scope.itemsPerPageOptions[0];
    // untill we have the correct total_count value from backend request:
    $scope.totalItems = $scope.itemsPerPage;

    $scope.getUsersForPagination();
    // --- end: initialization
    $scope.$watch('filters', function () {
        $scope.getUsersForPagination();
    }, true);

}];
