module.exports = [
    '$provide',
    '$httpProvider',
function(
    $provide,
    $httpProvider
) {

    // register the interceptor as a service
    $provide.factory('authInterceptor', [
        '$rootScope',
        '$injector',
        '$q',
        'CONST',
        'Session',
        '_',
    function(
        $rootScope,
        $injector,
        $q,
        CONST,
        Session,
        _
    ) {
        return {
            request: function(config) {

                var deferred = $q.defer();

                if (config.url.indexOf(CONST.API_URL) === -1) {
                    deferred.resolve(config);
                    return deferred.promise;
                }

                var accessToken = Session.getSessionDataEntry('accessToken');

                // if we already have an accessToken,
                // we will set it straight ahead
                // and resolve the promise for the config hash
                if(accessToken !== undefined && accessToken !== null)
                {
                    config.headers.Authorization = 'Bearer ' + accessToken;
                    deferred.resolve(config);
                }
                // otherwise, we will ask the backend
                // via the client credentials oauth flow
                // for an anonymous accessToken
                // (for some resources, of course,
                // this authorization level is not enough
                // and a 403 or 401 will be thrown
                // which results in showing the login page)
                else
                {
                    var payload = {
                        grant_type: 'client_credentials',
                        client_id: CONST.OAUTH_CLIENT_ID,
                        client_secret: CONST.OAUTH_CLIENT_SECRET,
                        scope: CONST.CLAIMED_ANONYMOUS_SCOPES.join(' ')
                    },

                    handleRequestSuccess = function(authResponse){
                        var accessToken = authResponse.data.access_token;
                        Session.setSessionDataEntry('accessToken', accessToken);
                        config.headers.Authorization = 'Bearer ' + accessToken;
                        deferred.resolve(config);
                    };

                    $injector.invoke(['$http', 'Util', function($http, Util) {
                        // $http is already constructed at the time and you may
                        // use it, just as any other service registered in your
                        // app module and modules on which app depends on.
                        // http://stackoverflow.com/a/19954545/567126
                        $http.post(Util.url('/oauth/token'), payload).then(handleRequestSuccess, deferred.reject);
                    }]);

                }
                return deferred.promise;
            },
            responseError: function(rejection) {
                if (_.contains([401, 403], rejection.status)) {
                    $rootScope.$broadcast('event:unauthorized');
                }
                return $q.reject(rejection);
            }
        };
    }]);
    $httpProvider.interceptors.push('authInterceptor');

}];
