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
    $translate('user.create').then(function(title) {
        $scope.title = title;
    });

    $scope.user = {};
    $scope.processing = false;

    $scope.saveUser = function(user) {
        $scope.processing = true;
        var response = UserEndpoint.save(user, function() {
            if (response.id) {
                $location.path('/tools/users/' + response.id);
            }
        }, function(errorResponse) { // error
            var errors = _.pluck(errorResponse.data && errorResponse.data.errors, 'message');
            errors && Notify.showAlerts(errors);
            $scope.processing = false;
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
