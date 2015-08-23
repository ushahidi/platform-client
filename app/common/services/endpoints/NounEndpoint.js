module.exports = [
    '$resource',
    'Util',
function (
    $resource,
    Util
) {

    var NounEndpoint = $resource(Util.apiUrl('/noun/:id'), {
        id: '@id'
    }, {
        query: {
            method: 'GET',
            isArray: true,
            transformResponse: function (data /*, header*/) {
                return Util.transformResponse(data).results;
            }
        }
    });

    return NounEndpoint;

}];
