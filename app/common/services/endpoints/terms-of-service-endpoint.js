module.exports = [
    '$resource',
    'Util',
function (
    $resource,
    Util
) {

    var TermsOfServiceEndpoint = $resource(Util.apiUrl('/termsofservice/:date/:id/:tosDate'), {
        date: '@date',
        id: '@id',
        tosDate: '@tosDate'

    }, {
        get: {
            method: 'GET'
        },
        save: {
            method: 'POST'
        },
        delete: {
            method: 'DELETE'
        }
    });

    return TermsOfServiceEndpoint;
}];
