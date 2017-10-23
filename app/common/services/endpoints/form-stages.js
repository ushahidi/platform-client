module.exports = [
    '$resource',
    'Util',
function (
    $resource,
    Util
) {

    var FormStageEndpoint = $resource(Util.apiUrl('/forms/:formId/stages/:id'), {
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
        get: {
            method: 'GET'
        },
        update: {
            method: 'PUT'
        },
        delete: {
            method: 'DELETE'
        }
    });

    FormStageEndpoint.save = function (item) {
        var persist = item.id ? FormStageEndpoint.update : FormStageEndpoint.save;
        return persist(item);
    };

    return FormStageEndpoint;
}];
