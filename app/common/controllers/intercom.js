module.exports = [
    '$scope',
    '$rootScope',
    'UserEndpoint',
    'ConfigEndpoint',
    '$q',
    '$window',
function (
    $scope,
    $rootScope,
    UserEndpoint,
    ConfigEndpoint,
    $q,
    $window
) {
    var pattern = /^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/\n]+)/g;
    $rootScope.$on('event:authentication:login:succeeded', function () {
        if ($window.self === $window.top) {
            $scope.startIntercom();
        }
    });

    $scope.startIntercom = function () {
        if ($window.ushahidi.intercomAppId !== '') {
            $q.all([
                ConfigEndpoint.get({ id: 'site' }).$promise,
                UserEndpoint.getFresh({id: 'me'}).$promise
            ]).then(function (results) {
                var site = results[0];
                var user = results[1];
                var domain = pattern.exec($window.ushahidi.apiUrl);
                domain = domain[1].replace('api.', '');

                $window.Intercom('boot', {
                    app_id: $window.ushahidi.intercomAppId,
                    email: user.email,
                    created_at: user.created,
                    user_id: domain + '_' + user.id,
                    'company': site.name,
                    'deployment_url': $window.ushahidi.apiUrl,
                    'realname' : user.realname,
                    'last_login': user.last_login,
                    'role': user.role
                });
            });
        }
    };

    $rootScope.$on('event:authentication:logout:succeeded', function () {
        $scope.stopIntercom();
    });

    $scope.stopIntercom = function () {
        if ($window.ushahidi.intercomAppId !== '') {
            $window.Intercom('shutdown');
        }
    };
}];
