module.exports = AuthInterceptorConfig;

AuthInterceptorConfig.$inject = ['$provide', '$httpProvider'];
function AuthInterceptorConfig($provide, $httpProvider) {
    // register the interceptor as a service
    $provide.factory('authInterceptor', AuthInterceptor);
    $httpProvider.interceptors.push('authInterceptor');
}

AuthInterceptor.$inject = ['$rootScope', '$injector', '$q', 'CONST', 'Session', '_'];
function AuthInterceptor($rootScope, $injector, $q, CONST, Session, _) {
    return {
        request: request,
        responseError: responseError
    };

    function getClientCredsToken(config) {
        var
        deferred = $q.defer(),
        payload = {
            grant_type: 'client_credentials',
            client_id: CONST.OAUTH_CLIENT_ID,
            client_secret: CONST.OAUTH_CLIENT_SECRET,
            scope: CONST.CLAIMED_ANONYMOUS_SCOPES.join(' ')
        };

        function handleRequestSuccess(authResponse) {
            var accessToken = authResponse.data.access_token;
            Session.setSessionDataEntry('accessToken', accessToken);
            config.headers.Authorization = 'Bearer ' + accessToken;
            deferred.resolve(config);
        }

        $injector.invoke(['$http', 'Util', function ($http, Util) {
            // $http is already constructed at the time and you may
            // use it, just as any other service registered in your
            // app module and modules on which app depends on.
            // http://stackoverflow.com/a/19954545/567126
            $http.post(Util.url('/oauth/token'), payload).then(handleRequestSuccess, deferred.reject);
        }]);

        return deferred.promise;
    }

    function request(config) {
        var deferred = $q.defer();

        if (_.has(config, 'params') && config.params.ignore403) {
            delete config.params.ignore403;
            config.ignorable = true;
        }

        if (config.url.indexOf(CONST.API_URL) === -1) {
            deferred.resolve(config);
            return deferred.promise;
        }

        var accessToken = Session.getSessionDataEntry('accessToken');

        // if we already have an accessToken,
        // we will set it straight ahead
        // and resolve the promise for the config hash
        if (accessToken !== undefined && accessToken !== null) {
            config.headers.Authorization = 'Bearer ' + accessToken;
            deferred.resolve(config);

        // otherwise, we will ask the backend
        // via the client credentials oauth flow
        // for an anonymous accessToken
        // (for some resources, of course,
        // this authorization level is not enough
        // and a 403 or 401 will be thrown
        // which results in showing the login page)
        } else {
            getClientCredsToken(config).then(deferred.resolve, deferred.reject);
        }
        return deferred.promise;
    }

    function responseError(rejection) {
        var deferred = $q.defer();

        // When a request is rejected there are
        // a few possible reasons. If its a 401
        // either our token expired, or we didn't have one.
        if (rejection.status === 401) {
            $injector.invoke(['Authentication', '$http', function (Authentication, $http) {
                // Check if were were logged in
                if (Authentication.getLoginStatus()) {
                    // If we were, trigger an unauthorized
                    // event and show the login page
                    $rootScope.$broadcast('event:unauthorized');
                    deferred.reject(rejection);
                } else {
                    // If we weren't logged in to start with
                    // we probably just need to get a new token
                    getClientCredsToken(rejection.config).then(
                        function (config) {
                            deferred.resolve($http(config));
                        },
                        deferred.reject
                    );
                }
            }]);
        // If its a 403 we've got a token, but it can't get us what we needed
        } else if (rejection.status === 403) {
            // In the short term, we will handle failures for
            // associated entities - for example posts that contain unviewable tags -
            // we will ignore the error. In future this will be rectified under issue:
            // https://github.com/ushahidi/platform/issues/793
            if (!rejection.config.ignorable) {
                // Trigger a forbidden event and show an error page
                $rootScope.$broadcast('event:forbidden');
            }
            deferred.reject(rejection);
        // For anything else, just forward the rejection
        } else {
            deferred.reject(rejection);
        }
        return deferred.promise;
    }
}
