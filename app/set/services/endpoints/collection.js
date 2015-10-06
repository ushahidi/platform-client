module.exports = [
    '$resource',
    'Util',
    '_',
    'CacheFactory',
function (
    $resource,
    Util,
    _,
    CacheFactory
) {
    //var cache = new CacheFactory('collectionCache');

    var CollectionEndpoint = $resource(Util.apiUrl('/collections/:collectionId'), {
        collectionId: '@collectionId'
    }, {
        query: {
            method: 'GET',
            isArray: true,
            transformResponse: function (data /*, header*/) {
                return angular.fromJson(data).results;
            },
            //cache: cache
        },
        get: {
            method: 'GET',
            //cache: cache
        },
        update: {
            method: 'PUT'
        },
        editableByMe: {
            method: 'GET',
            isArray: true,
            // uncomment line below once implemented server-side
            // for now, _.filter in the transformResponse function replaces the back-end implementation
            //  url: Util.apiUrl('/collections?user_id=me'),
            params : { editableBy : 'me' }, // Hack to differentiate cache key from full query
            transformResponse: function (data /*, header*/) {
                return _.filter(angular.fromJson(data).results, function (result) {
                    return _.includes(result.allowed_privileges, 'update');
                });
            },
            //cache: cache
        },
        addPost: {
            method: 'POST',
            url: Util.apiUrl('/collections/:collectionId/posts')
        },
        removePost: {
            method: 'DELETE',
            url: Util.apiUrl('/collections/:collectionId/posts')
        },
        delete: {
            method: 'DELETE'
        }
    });

    return CollectionEndpoint;
}];
