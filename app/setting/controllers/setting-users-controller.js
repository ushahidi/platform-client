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
    Notify
) {
    var handleResponseErrors, checkAndNotifyAboutManipulateOwnUser;
    $rootScope.setLayout('layout-a');
    $translate('tool.manage_users').then(function (title) {
        $scope.title = title;
        $scope.$emit('setPageTitle', title);
    });

    $scope.filters = {
        roles: [],
        q: null
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
        Notify.showApiErrors(errorResponse);
    };

    checkAndNotifyAboutManipulateOwnUser = function (translationKey) {
        var currentUserId = Session.getSessionDataEntry('userId');
        if (_.contains($scope.selectedUsers, currentUserId)) {
            $translate(translationKey).then(function (message) {
                Notify.showSingleAlert(message);
            });
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
        $translate('notify.user.bulk_destroy_confirm', {
            count: $scope.selectedUsers.length
        }).then(function (message) {
            Notify.showConfirm(message).then(function () {
                var calls = [];
                angular.forEach($scope.selectedUsers, function (userId) {
                    calls.push(UserEndpoint.delete({ id: userId }).$promise);
                });

                $q.all(calls).then(function () {
                    $translate('notify.user.bulk_destroy_success').then(function (message) {
                        Notify.showNotificationSlider(message);
                    });
                    $scope.getUsersForPagination();
                }, handleResponseErrors)
                .finally($scope.filterRole);
            }, function () {});
        });
    };

    $scope.changeRole = function (role) {
        if (checkAndNotifyAboutManipulateOwnUser('user.cannot_change_your_own_role')) {
            return;
        }

        $translate('notify.user.bulk_role_change_confirm', {
            count: $scope.selectedUsers.length,
            role:  role.display_name
        }).then(function (message) {
            Notify.showConfirm(message).then(function () {
                var calls = [];
                angular.forEach($scope.selectedUsers, function (userId) {
                    calls.push(UserEndpoint.saveCache({ id: userId, role: role.name }).$promise);
                });
                $q.all(calls).then(function () {
                    $translate('notify.user.bulk_role_change_success', {role_name: role.name}).then(function (message) {
                        Notify.showNotificationSlider(message);
                    });
                    $scope.getUsersForPagination();
                }, handleResponseErrors)
                .finally($scope.filterRole);
            });
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
        UserEndpoint.queryFresh({
            offset: ($scope.currentPage - 1) * $scope.itemsPerPage,
            limit: $scope.itemsPerPage,
            roles: $scope.filters.roles,
            q: $scope.filters.q
        }).$promise.then(function (usersResponse) {
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

}];
