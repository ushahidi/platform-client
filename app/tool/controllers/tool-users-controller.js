module.exports = [
    '$scope',
    '$translate',
    '$q',
    '_',
    '$window',
    'gravatar',
    'Session',
    'UserEndpoint',
    'Notify',
    'RoleHelper',
function(
    $scope,
    $translate,
    $q,
    _,
    $window,
    gravatar,
    Session,
    UserEndpoint,
    Notify,
    RoleHelper
) {
    var handleResponseErrors, checkAndNotifyAboutManipulateOwnUser;

    $translate('api.users').then(function(title){
        $scope.title = title;
    });

    $scope.roles = RoleHelper.roles;
    $scope.getRole = RoleHelper.getRole;

    $scope.selectedUsers = [];

    $scope.isToggled = function(user) {
        return $scope.selectedUsers.indexOf(user.id) > -1;
    };

    $scope.toggleUser = function(user) {
        var idx = $scope.selectedUsers.indexOf(user.id);
        if (idx > -1) {
            $scope.selectedUsers.splice(idx, 1);
        } else {
            $scope.selectedUsers.push(user.id);
        }
    };


    handleResponseErrors = function(errorResponse){
        var errors = _.pluck(errorResponse.data && errorResponse.data.errors, 'message');
        errors && Notify.showAlerts(errors);
    };

    checkAndNotifyAboutManipulateOwnUser = function(translationKey) {
        var currentUserId = Session.getSessionDataEntry('userId');
        if(_.contains($scope.selectedUsers, currentUserId))
        {
            $translate(translationKey).then(function(message){
                Notify.showSingleAlert(message);
            });
            return true;
        }
        return false;
    };

    $scope.deleteUsers = function() {

        if(checkAndNotifyAboutManipulateOwnUser('user.cannot_delete_yourself'))
        {
            return;
        }

        $translate('notify.user.bulk_destroy_confirm', {
            count: $scope.selectedUsers.length
        }).then(function(message) {
            if ($window.confirm(message)) {
                var calls = [];
                angular.forEach($scope.selectedUsers, function(userId) {
                    calls.push( UserEndpoint.delete({ id: userId }).$promise );
                });

                $q.all(calls).then($scope.filterRole, handleResponseErrors)
                .finally($scope.filterRole);
            }
        });
    };

    $scope.changeRole = function(role) {
        if(checkAndNotifyAboutManipulateOwnUser('user.cannot_change_your_own_role'))
        {
            return;
        }

        $translate('notify.user.bulk_role_change_confirm', {
            count: $scope.selectedUsers.length,
            role:  role.display_name
        }).then(function(message) {
            if ($window.confirm(message)) {
                var calls = [];
                angular.forEach($scope.selectedUsers, function(userId) {
                    calls.push( UserEndpoint.update({ id: userId }, { id: userId, role: role.name }).$promise );
                });
                $q.all(calls).then($scope.filterRole, handleResponseErrors)
                .finally($scope.filterRole);
            }
        });
    };

    $scope.filteredRole = '';
    $scope.filterRole = function(role) {
        $scope.filteredRole = (role ? role.name : '');
        $scope.users = UserEndpoint.query({ role: $scope.filteredRole });
        $scope.selectedUsers = [];
    };

    // hydrate!
    $scope.users = UserEndpoint.query();
}];
