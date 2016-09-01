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

    if (!(cache = CacheFactory.get('formRoleCache'))) {
        cache = new CacheFactory('formRoleCache');
    }

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
            },
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

    FormRoleEndpoint.getFresh = function (params) {
        cache.remove(Util.apiUrl('/forms/' + params.formId + '/roles/'));
        return FormRoleEndpoint.get(params);
    };

    FormRoleEndpoint.invalidateCache = function () {
        return cache.removeAll();
    };

    FormRoleEndpoint.queryFresh = function (params) {
        cache.removeAll();
        return FormRoleEndpoint.query(params);
    };

    FormRoleEndpoint.saveCache = function (item) {
        var persist = FormRoleEndpoint.update;
        cache.removeAll();
        var result = persist(item);
        return result;
    };

    return FormRoleEndpoint;
}];
