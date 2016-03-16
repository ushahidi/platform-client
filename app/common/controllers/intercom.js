module.exports = [
    '$scope',
    '$rootScope',
    'UserEndpoint',
function (
    $scope,
    $rootScope,
    UserEndpoint
) {
    $rootScope.$on('event:authentication:login:succeeded', function () {
        UserEndpoint.getFresh({id: 'me'}).$promise.then(function (user) {
            window.Intercom('boot', {
                app_id: window.ushahidi.intercomAppId,
                email: user.email,
                created_at: user.created,
                user_id: user.id,
                'realname' : user.realname,
                'last_login': user.last_login,
                'role': user.role,
                'logins': user.logins
            });
        });
    });

    $rootScope.$on('event:authentication:logout:succeeded', function () {
        window.Intercom('shutdown');
    });
}];
