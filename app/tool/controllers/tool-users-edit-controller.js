module.exports = [
    '$scope',
    '$rootScope',
    '$translate',
    '$location',
    '$routeParams',
    'UserEndpoint',
    'Notify',
    '_',
function(
    $scope,
    $rootScope,
    $translate,
    $location,
    $routeParams,
    UserEndpoint,
    Notify,
    _
) {
    $translate('user.edit').then(function(title) {
        $scope.title = title;
    });

    $scope.user = UserEndpoint.get({id: $routeParams.id});

    $scope.processing = false;

    $scope.saveUser = function(user) {
        $scope.processing = true;
        UserEndpoint.update({id: $routeParams.id}, user, function() {
            $rootScope.goBack();
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
