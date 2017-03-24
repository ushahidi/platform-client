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

    if (!(cache = CacheFactory.get('webhookCache'))) {
        cache = new CacheFactory('webhookCache');
    }

    var WebhookEndpoint = $resource(Util.apiUrl('/webhooks/:id'), {
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

    WebhookEndpoint.getFresh = function (params) {
        cache.remove(Util.apiUrl('/webhooks/' + params.id));
        return WebhookEndpoint.get(params);
    };

    WebhookEndpoint.invalidateCache = function () {
        return cache.removeAll();
    };

    WebhookEndpoint.queryFresh = function () {
        cache.removeAll();
        return WebhookEndpoint.query();
    };

    WebhookEndpoint.saveCache = function (item) {
        var persist = item.id ? WebhookEndpoint.update : WebhookEndpoint.save;
        cache.removeAll();
        var result = persist(item);
        return result;
    };

    WebhookEndpoint.delete = function (item) {
        cache.removeAll();
        return WebhookEndpoint.deleteEntity(item);
    };

    return WebhookEndpoint;

}];
