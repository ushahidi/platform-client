module.exports = [
    '$resource',
    'Util',
    'CacheFactory',
function (
    $resource,
    Util,
    CacheFactory
) {
    //var cache = new CacheFactory('searchCache');

    var SavedSearchEndpoint = $resource(Util.apiUrl('/savedsearches/:id'), {
        id: '@id'
    }, {
        query: {
            method: 'GET',
            isArray: true,
            transformResponse: function (data /*, header*/) {
                return angular.fromJson(data).results;
            }
            //cache: cache
        },
        get: {
            method: 'GET'
            //cache: cache
        },
        update: {
            method: 'PUT'
        },
        delete: {
            method: 'DELETE'
        }
    });

    return SavedSearchEndpoint;

}];
