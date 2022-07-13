module.exports = AuthInterceptorConfig;

AuthInterceptorConfig.$inject = ['$provide', '$httpProvider'];
function AuthInterceptorConfig($provide, $httpProvider) {
    // register the interceptor as a service
    $provide.factory('authInterceptor', AuthInterceptor);
    $httpProvider.interceptors.push('authInterceptor');
}

AuthInterceptor.$inject = ['$rootScope', '$injector', '$q', 'CONST', 'Session', '_'];
function AuthInterceptor($rootScope, $injector, $q, CONST, Session, _) {
    var ongoingRequest = null;
    return {
        request: request,
        responseError: responseError
    };

    function request(config) {
        var deferred = $q.defer();
        config.ignorable = shouldIgnoreAuthError(config);
        config.headers['Accept-Language'] = Session.getSessionDataEntry('language') ? Session.getSessionDataEntry('language') : 'en-US';
        if (config.url.indexOf(CONST.API_URL) === -1) {
            deferred.resolve(config);
            return deferred.promise;
        }

        var accessToken = Session.getSessionDataEntry('accessToken');
        var accessTokenExpires = Session.getSessionDataEntry('accessTokenExpires');
        var now = Math.floor(Date.now() / 1000);
        if (accessToken !== undefined && accessToken !== null && accessTokenExpires > now) {
            // if we already have a valid accessToken,
            // we will set it straight ahead
            // and resolve the promise for the config hash
            config.headers.Authorization = 'Bearer ' + accessToken;

        }
        deferred.resolve(config);
        return deferred.promise;
    }

    function responseError(rejection) {
        var deferred = $q.defer();
        // When a request is rejected there are
        // a few possible reasons. If its a 401
        // either our token expired, or we didn't have one.
        if (rejection.status === 401 || rejection.status === 400) {
            $injector.invoke(['Authentication', '$http', function (Authentication, $http) {
                // Check if were were logged in
                if (Authentication.getLoginStatus()) {
                    // If we were, trigger an unauthorized
                    // event and show the login page
                    $rootScope.$broadcast('event:unauthorized');
                    deferred.reject(rejection);
                } else {
                        // If this request was ignorable, ie ok to fail
                        // just continue.
                    if (rejection.config.ignorable) {
                        deferred.reject(rejection);
                        return deferred.promise;
                    }
                    // Here we got the client-creds token previously. What to do now? Just reject the promise?
                    deferred.reject(rejection);
                }
            }]);
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

    /**
         * Returns true if url is ignorable, false if not
         * @param config
         */
    function shouldIgnoreAuthError(config) {
        var isIgnorable = false;
        if (_.has(config, 'params') && config.params.ignore403) {
            delete config.params.ignore403;
            isIgnorable = true;
        }
        var i = 0;
        var matchers = ['/oauth/token(/|$)', '/users(/|$)([0-9]+|$)', '/roles(/|$)'];
        while (isIgnorable === false && i < matchers.length) {
            isIgnorable = !!config.url.match(matchers[i]);
            i++;
        }
        return isIgnorable;
    }
}
