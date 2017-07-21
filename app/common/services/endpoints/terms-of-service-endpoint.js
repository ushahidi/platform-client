module.exports = [
    '$resource',
    'Util',
function (
    $resource,
    Util
) {

    var TermsOfServiceEndpoint = $resource(Util.apiUrl('/tos/:id'), {
        id: '@id'

    }, {
        get: {
            method: 'GET'
        },
        delete: {
            method: 'DELETE'
        }
    });

    return TermsOfServiceEndpoint;
}];
