module.exports = [
    '$scope',
    '$translate',
    '$q',
    '_',
    '$window',
    'Session',
    'UserEndpoint',
    'Notify',
    'RoleHelper',
function (
    $scope,
    $translate,
    $q,
    _,
    $window,
    Session,
    UserEndpoint,
    Notify,
    RoleHelper
) {
    var handleResponseErrors, checkAndNotifyAboutManipulateOwnUser, getUsersForPagination;

    $translate('tool.manage_users').then(function (title) {
        $scope.title = title;
        $scope.$emit('setPageTitle', title);
    });

    $scope.roles = RoleHelper.roles(true);
    $scope.getRole = RoleHelper.getRole;

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
        var errors = _.pluck(errorResponse.data && errorResponse.data.errors, 'message');
        errors && Notify.showAlerts(errors);
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

    $scope.deleteUsers = function () {

        if (checkAndNotifyAboutManipulateOwnUser('user.cannot_delete_yourself')) {
            return;
        }

        $translate('notify.user.bulk_destroy_confirm', {
            count: $scope.selectedUsers.length
        }).then(function (message) {
            if ($window.confirm(message)) {
                var calls = [];
                angular.forEach($scope.selectedUsers, function (userId) {
                    calls.push(UserEndpoint.delete({ id: userId }).$promise);
                });

                $q.all(calls).then($scope.filterRole, handleResponseErrors)
                .finally($scope.filterRole);
            }
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
            if ($window.confirm(message)) {
                var calls = [];
                angular.forEach($scope.selectedUsers, function (userId) {
                    calls.push(UserEndpoint.update({ id: userId }, { id: userId, role: role.name }).$promise);
                });
                $q.all(calls).then($scope.filterRole, handleResponseErrors)
                .finally($scope.filterRole);
            }
        });
    };

    $scope.filterRole = function (role) {
        $scope.filteredRole = (role ? role.name : '');
        getUsersForPagination();
        $scope.selectedUsers = [];
    };

    $scope.itemsPerPageChanged = function (count) {
        $scope.itemsPerPage = count;
        getUsersForPagination();
    };

    // // hydrate!
    // $scope.users = UserEndpoint.query();


    // --- start: definitions
    getUsersForPagination = function () {
        UserEndpoint.query({
            offset: ($scope.currentPage - 1) * $scope.itemsPerPage,
            limit: $scope.itemsPerPage,
            role: $scope.filteredRole
        }).$promise.then(function (usersResponse) {
            $scope.users = usersResponse.results;
            $scope.totalItems = usersResponse.total_count;
        });
    };

    $scope.pageChanged = getUsersForPagination;
    // --- end: definitions


    // --- start: initialization
    $scope.filteredRole = '';
    $scope.currentPage = 1;
    $scope.itemsPerPageOptions = [10, 20, 50];
    $scope.itemsPerPage = $scope.itemsPerPageOptions[0];
    // untill we have the correct total_count value from backend request:
    $scope.totalItems = $scope.itemsPerPage;

    getUsersForPagination();
    // --- end: initialization

}];
