module.exports = [
    '$scope',
    '$translate',
    '$location',
    'UserEndpoint',
    'Notify',
    '_',
function(
    $scope,
    $translate,
    $location,
    UserEndpoint,
    Notify,
    _
) {
    $translate('user_create.title').then(function(title) {
        $scope.title = title;
    });

    $scope.user = {};
    $scope.saving_user = false;

    $scope.goBack = function() {
        $location.path('/users/');
    };

    $scope.saveUser = function(user) {
        $scope.saving_user = true;
        var response = UserEndpoint.save(user, function() {
            if (response.id) {
                $location.path('/users/' + response.id + '/profile');
            }
        }, function(errorResponse) { // error
            var errors = _.pluck(errorResponse.data && errorResponse.data.errors, 'message');
            errors && Notify.showAlerts(errors);
            $scope.saving_user = false;
        });
    };

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
