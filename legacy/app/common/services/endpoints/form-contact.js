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

    if (!(cache = CacheFactory.get('formContactCache'))) {
        cache = CacheFactory.createCache('formContactCache');
    }
    cache.removeExpired();

    var FormContactEndpoint = $resource(Util.apiUrl('/forms/:formId/contacts/'), {
        formId: '@formId'
    }, {
        query: {
            method: 'GET',
            isArray: true,
            cache: cache
        },
        get: {
            method: 'GET',
            cache: cache
        },
        update: {
            method: 'PUT'
        }
    });
    return FormContactEndpoint;
}];
