module.exports = [
    '$scope',
    '$translate',
    '$routeParams',
    'UserEndpoint',
    'Notify',
    '_',
function(
    $scope,
    $translate,
    $routeParams,
    UserEndpoint,
    Notify,
    _
) {
    $translate('user_profile.title').then(function(title) {
        $scope.title = title;
    });

    $scope.getRole = function(role) {
        for (var i = 0; i < $scope.roles.length; i++) {
            if ($scope.roles[i].name === role) {
                return $scope.roles[i].display_name;
            }
        }
        return role;
    };

    $scope.onUserProfileEditFormShow = function() {
        $scope.userProfileDataForEdit = angular.copy($scope.userProfileData);
    };

    $scope.saveUserProfile = function() {
        var promise = UserEndpoint.update({id: $routeParams.id}, $scope.userProfileDataForEdit).$promise;

        promise.then(
            function(userData) {
                $scope.userProfileData = $scope.userProfileDataForEdit = userData;
            },
            function(errorResponse) {
                if (errorResponse.status === 400) {
                    var errors = _.pluck(errorResponse.data && errorResponse.data.errors, 'message');
                    if (errors) {
                        Notify.showAlerts(errors);
                    }
                }
            }
        );

        return promise;
    };

    UserEndpoint.get({id: $routeParams.id}).$promise.then(function(userData){
        $scope.userProfileData = $scope.userProfileDataForEdit = userData;
    });

    $scope.roles = [
        // TODO: make this an endpoint
        {
            name: 'guest',
            display_name: 'Guest',
        },
        {
            name: 'user',
            display_name: 'Member',
        },
        {
            name: 'admin',
            display_name: 'Admin',
        }
    ];
}];
