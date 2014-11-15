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
        '$q',
        'CONST',
    function(
        $rootScope,
        $q,
        CONST
    ) {
        return {
            request: function(config) {
                if (config.url.indexOf(CONST.API_URL) !== -1) {
                    var accessToken = localStorage.getItem('access_token');
                    config.headers.Authorization = 'Bearer ' + accessToken;
                }
                return config;
            },
            responseError: function(rejection) {
                if (rejection.status === 401) {
                    var deferred = $q.defer();
                    $rootScope.$broadcast('event:unauthorized');
                    return deferred.promise;
                }
                return $q.reject(rejection);
            }
        };
    }]);
    $httpProvider.interceptors.push('authInterceptor');

}];
