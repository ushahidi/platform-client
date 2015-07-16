module.exports = [
    '$resource',
    'Util',
function (
    $resource,
    Util
) {

    var CollectionEndpoint = $resource(Util.apiUrl('/collections/:id/:extra'), {
        id: '@id'
    }, {
        query: {
            method: 'GET',
            isArray: true,
            transformResponse: function (data /*, header*/) {
                return angular.fromJson(data).results;
            }
        }
    });

    return CollectionEndpoint;

}];
