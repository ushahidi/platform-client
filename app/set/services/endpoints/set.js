module.exports = [
    '$resource',
    'Util',
function(
    $resource,
    Util
) {

    var SetsEndpoint = $resource(Util.apiUrl('/sets/:id'), {
        id: '@id',
        order: 'asc',
        orderby: 'name'
    }, {
        query: {
            method: 'GET',
            isArray: true,
            transformResponse: function(data /*, header*/) {
                return Util.transformResponse(data).results;
            }
        }
    });

    return SetsEndpoint;

}];
