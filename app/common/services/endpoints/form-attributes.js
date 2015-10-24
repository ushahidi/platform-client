module.exports = [
    '$resource',
    'Util',
    'CacheFactory',
function (
    $resource,
    Util,
    CacheFactory
) {
    var cache;

    if (!(cache = CacheFactory.get('attrCache'))) {
        cache = new CacheFactory('attrCache');
    }

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
            },
            cache: cache
        },
        get: {
            method: 'GET',
            cache: cache
        },
        update: {
            method: 'PUT'
        },
        delete: {
            method: 'DELETE'
        }
    });

    FormAttributeEndpoint.getFresh = function (id) {
        cache.remove(Util.apiUrl(id));
        return FormAttributeEndpoint.get(id);
    };

    FormAttributeEndpoint.queryFresh = function (params) {
        cache.removeAll();
        return FormAttributeEndpoint.query(params);
    };

    FormAttributeEndpoint.saveCache = function (item) {
        var persist = item.id ? FormAttributeEndpoint.update : FormAttributeEndpoint.save;

        cache.removeAll();
        return persist(item);
    };

    return FormAttributeEndpoint;
}];
