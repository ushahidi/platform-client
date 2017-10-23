module.exports = [
    '$resource',
    'Util',
function (
    $resource,
    Util
) {


    var FormAttributeEndpoint = $resource(Util.apiUrl('/forms/:formId/attributes/:id'), {
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

    FormAttributeEndpoint.save = function (item) {
        var persist = item.id ? FormAttributeEndpoint.update : FormAttributeEndpoint.save;
        return persist(item);
    };

    return FormAttributeEndpoint;
}];
