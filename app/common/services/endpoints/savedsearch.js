module.exports = [
    '$resource',
    'Util',
function (
    $resource,
    Util
) {

    var SavedSearchEndpoint = $resource(Util.apiUrl('/savedsearches/:id'), {
        id: '@id'
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
        delete: {
            method: 'DELETE'
        }
    });

    return SavedSearchEndpoint;

}];
