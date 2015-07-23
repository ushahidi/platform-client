module.exports = [
    '$resource',
    'Util',
    '_',
function (
    $resource,
    Util,
    _
) {

    var CollectionEndpoint = $resource(Util.apiUrl('/collections/:collectionId'), {
        collectionId: '@collectionId'
    }, {
        query: {
            method: 'GET',
            isArray: true,
            transformResponse: function (data /*, header*/) {
                return angular.fromJson(data).results;
            }
        },
        editableByMe: {
            method: 'GET',
            isArray: true,
            // uncomment line below once implemented server-side
            // for now, _.filter in the transformResponse function replaces the back-end implementation
            //  url: Util.apiUrl('/collections?user_id=me'),
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
            url: Util.apiUrl('/collections/:collectionId/posts')
        }
    });

    return CollectionEndpoint;
}];
