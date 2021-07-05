module.exports = [
    '$scope',
    '$rootScope',
    'Authentication',
    'UserEndpoint',
    'ConfigEndpoint',
    '$q',
    '$window',
    '$location',
function (
    $scope,
    $rootScope,
    Authentication,
    UserEndpoint,
    ConfigEndpoint,
    $q,
    $window,
    $location
) {
    $scope.startIntercom = startIntercom;
    $scope.stopIntercom = stopIntercom;

    activate();
    function activate() {
        $rootScope.$on('event:authentication:login:succeeded', function () {
            $scope.startIntercom();
        });

        $rootScope.$on('event:authentication:logout:succeeded', function () {
            $scope.stopIntercom();
        });

        if (Authentication.getLoginStatus()) {
            $scope.startIntercom();
        }
    }

    function startIntercom() {
        if ($window.ushahidi.intercomAppId !== '') {
            $q.all([
                ConfigEndpoint.get({ id: 'site' }).$promise,
                UserEndpoint.getFresh({id: 'me'}).$promise
            ]).then(function (results) {
                var site = results[0];
                var user = results[1];
                var domain = $location.host();

                $window.Intercom('boot', {
                    app_id: $window.ushahidi.intercomAppId,
                    custom_launcher_selector: '#intercom_custom_launcher',
                    hide_default_launcher: true,
                    email: user.email,
                    created_at: user.created,
                    user_id: domain + '_' + user.id,
                    'deployment_url': domain,
                    'realname' : user.realname,
                    'last_login': user.last_login,
                    'role': user.role,
                    company: {
                        name: site.name,
                        id: domain,
                        created_at: 0, // Faking this because we don't have this data
                        plan: site.tier
                    }
                });
            });
        }
    }

    function stopIntercom() {
        if ($window.ushahidi.intercomAppId !== '') {
            $window.Intercom('shutdown');
        }
    }
}];
