module.exports = [
    '$resource',
    'Util',
function (
    $resource,
    Util
) {

    var TermsOfServiceEndpoint = $resource(Util.apiUrl('/tos/'), {

    }, {
        get: {
            method: 'GET'
        }
    });

    return TermsOfServiceEndpoint;
}];
