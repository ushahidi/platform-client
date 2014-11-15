module.exports = [
    '$resource',
    'Util',
function(
    $resource,
    Util
) {

    var FormAttributeEndpoint = $resource(API_URL + '/attributes/:id', {
        id: '@id'
    }, {
        query: {
            method: 'GET',
            isArray: true,
            transformResponse: function(data /*, header*/) {
                return Util.transformResponse(data).results;
            }
        }
    });

    return FormAttributeEndpoint;
}];
