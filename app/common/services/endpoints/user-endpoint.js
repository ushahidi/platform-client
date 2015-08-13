module.exports = [
    '$resource',
    '$rootScope',
    'Util',
    'CacheFactory',
function (
    $resource,
    $rootScope,
    Util,
    CacheFactory
) {
    var cache = CacheFactory('userCache');

    var UserEndpoint = $resource(Util.apiUrl('/users/:id'), {
        id: '@id'
    }, {
        query: {
            method: 'GET',
            isArray: false,
            transformResponse: function (data /*, header*/) {
                return angular.fromJson(data);
            }
        },
        get: {
            method: 'GET',
            cache: cache
        },
        update: {
            method: 'PUT'
        }
    });

    return UserEndpoint;
}];
