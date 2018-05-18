module.exports = [
    '$resource',
    'Util',
function (
    $resource,
    Util
) {

    var HxlMetadataEndpoint = $resource(Util.apiUrl('/hxl/metadata'), {
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

    return HxlMetadataEndpoint;

}];
