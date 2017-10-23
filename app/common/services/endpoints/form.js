module.exports = [
    '$resource',
    'Util',
function (
    $resource,
    Util
) {

    var FormEndpoint = $resource(Util.apiUrl('/forms/:id'), {
            id: '@id'
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

    FormEndpoint.save = function (item) {
        var persist = item.id ? FormEndpoint.update : FormEndpoint.save;
        return persist(item);
    };

    return FormEndpoint;

}];
