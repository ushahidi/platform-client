module.exports = [
    '$resource',
    'Util',
function (
    $resource,
    Util
) {

    var FormRoleEndpoint = $resource(Util.apiUrl('/forms/:formId/roles/'), {
        formId: '@formId',
        order: 'asc',
        orderby: 'role_id'
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
        }
    });

    return FormRoleEndpoint;
}];
