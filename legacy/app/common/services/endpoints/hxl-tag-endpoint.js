module.exports = [
    '$resource',
    'Util',
function (
    $resource,
    Util
) {

    var HxlTagEndpoint = $resource(Util.apiUrl('/hxl/tags'), {
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

    return HxlTagEndpoint;

}];
