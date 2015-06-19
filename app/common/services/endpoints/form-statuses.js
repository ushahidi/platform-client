module.exports = [
    '$resource',
    'Util',
function (
    $resource,
    Util
) {

    var FormStatusEndpoint = $resource(Util.apiUrl('/forms/:formId/statuses/:id'), {
        formId: '@formId',
        id: '@id',
        order: 'asc',
        orderby: 'priority'
    }, {
        query: {
            method: 'GET',
            isArray: true,
            transformResponse: function (data /*, header*/) {
                return Util.transformResponse(data).results;
            }
        },
        update: {
            method: 'PUT'
        },
        delete: {
            method: 'DELETE'
        }
    });

    return FormStatusEndpoint;
}];
