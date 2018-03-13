module.exports = [
    '$resource',
    'Util',
function (
    $resource,
    Util
) {

    var CountryCodeEndpoint = $resource(Util.apiUrl('/country-codes/'), {

    }, {
        get: {
            method: 'GET'
        }
    });

    return CountryCodeEndpoint;
}];
