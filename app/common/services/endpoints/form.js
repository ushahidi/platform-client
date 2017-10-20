module.exports = [
    '$resource',
    'Util',
function (
    $resource,
    Util
) {

    var FormEndpoint = $resource(Util.apiUrl('/forms/:id'), {
            id: '@id'
        }, {
        query: {
            method: 'GET',
            isArray: true,
            transformResponse: function (data /*, header*/) {
                return Util.transformResponse(data).results;
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

    return FormEndpoint;

}];
