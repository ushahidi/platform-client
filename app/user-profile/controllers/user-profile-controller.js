module.exports = [
    '$scope',
    '$rootScope',
    '$translate',
    'UserEndpoint',
    'Notify',
    '_',
function (
    $scope,
    $rootScope,
    $translate,
    UserEndpoint,
    Notify,
    _
) {
    $translate('user_profile.title').then(function (title) {
        $scope.title = title;
        $rootScope.$emit('setPageTitle', title);
    });

    $scope.onUserProfileEditFormShow = function () {
        $scope.userProfileDataForEdit = angular.copy($scope.userProfileData);
    };

    $scope.saveUserProfile = function () {
        var promise = UserEndpoint.update({id: 'me'}, $scope.userProfileDataForEdit).$promise;

        promise.then(
            function (userData) {
                $scope.userProfileData = $scope.userProfileDataForEdit = userData;
            },
            function (errorResponse) {
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

    UserEndpoint.get({id: 'me'}).$promise.then(function (userData) {
        $scope.userProfileData = $scope.userProfileDataForEdit = userData;
    });

}];
