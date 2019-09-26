module.exports = [
    '$resource',
    'Util',
    '_',
function (
    $resource,
    Util,
    _
) {

    // Force ordering by date created
    var CollectionEndpoint = $resource(Util.apiUrl('/collections/:collectionId?orderby=:orderby'), {
        collectionId: '@collectionId',
        orderby: 'created',
        order: 'DESC'
    }, {
        query: {
            method: 'GET',
            isArray: true,
            transformResponse: function (data /*, header*/) {
                return angular.fromJson(data).results;
            }
        },
        get: {
            method: 'GET'
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
            }
        },
        addPost: {
            method: 'POST',
            url: Util.apiUrl('/collections/:collectionId/posts')
        },
        removePost: {
            method: 'DELETE',
            url: Util.apiUrl('/collections/:collectionId/posts/:id')
        },
        delete: {
            method: 'DELETE'
        }
    });

    return CollectionEndpoint;
}];
