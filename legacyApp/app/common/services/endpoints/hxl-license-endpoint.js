module.exports = [
    '$resource',
    'Util',
function (
    $resource,
    Util
) {

    var HxlLicenseEndpoint = $resource(Util.apiUrl('/hxl/licenses'), {
            id: '@id'
        }, {
        get: {
            method: 'GET'
        },
        update: {
            method: 'PUT'
        },
        deleteEntity: {
            method: 'DELETE'
        }
    });

    return HxlLicenseEndpoint;

}];
