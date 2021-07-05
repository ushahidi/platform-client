module.exports = [
    '$resource',
    'Util',
function (
    $resource,
    Util
) {

    var HxlOrganisationsEndpoint = $resource(Util.apiUrl('/hxl/organisations'), {
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

    return HxlOrganisationsEndpoint;

}];
