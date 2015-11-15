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

    if (!(cache = CacheFactory.get('formCache'))) {
        cache = new CacheFactory('formCache');
    }

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
            method: 'GET',
            cache: cache
        },
        update: {
            method: 'PUT'
        },
        deleteEntity: {
            method: 'DELETE'
        }
    });

    FormEndpoint.getFresh = function (id) {
        cache.remove(Util.apiUrl(id));
        return FormEndpoint.get(id);
    };

    FormEndpoint.invalidateCache = function () {
        return cache.removeAll();
    };

    FormEndpoint.queryFresh = function () {
        cache.removeAll();
        return FormEndpoint.query();
    };

    FormEndpoint.saveCache = function (item) {
        var persist = item.id ? FormEndpoint.update : FormEndpoint.save;
        cache.removeAll();
        var result = persist(item);
        return result;
    };

    FormEndpoint.delete = function (item) {
        cache.removeAll();
        return FormEndpoint.deleteEntity(item);
    };

    return FormEndpoint;

}];
