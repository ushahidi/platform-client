module.exports = [
    '$q',
    '$http',
    '$resource',
    '$rootScope',
    'Util',
    'CacheFactory',
function (
    $q,
    $http,
    $resource,
    $rootScope,
    Util,
    CacheFactory
) {
    var cache;
    if (!(cache = CacheFactory.get('importJobCache'))) {
        cache = CacheFactory.createCache('importJobCache');
    }
    cache.removeExpired();

    var DataImportEndpoint = $resource(Util.apiUrl('/csv/:id/:action'), {
        id: '@id',
        action: '@action'
    }, {
        get: {
            method: 'GET',
            params: {'ignore403': '@ignore403'}
        },
        update: {
            method: 'PUT'
        },
        delete: {
            method: 'DELETE'
        },
        import: {
            method: 'POST'
        },
        query: {
            method: 'GET',
            isArray: true,
            transformResponse: function (data /*, header*/) {
                return Util.transformResponse(data).results;
            }
        }
    });
    DataImportEndpoint.getFresh = function (params) {
        cache.remove(Util.apiUrl('/csv/' + params.id));
        return DataImportEndpoint.get(params);
    };
    DataImportEndpoint.queryFresh = function (params) {
        cache.removeAll();
        return DataImportEndpoint.query(params);
    };

    DataImportEndpoint.upload = function (formData) {
        var dfd = $q.defer();
        $http.post(
            Util.apiUrl('/csv'),
            formData,
            {
                headers: {
                    'Content-Type': undefined
                }
            }
        ).then(function (response) {
            dfd.resolve(Util.transformResponse(response.data));
        }, function (errorResponse) {
            dfd.reject(errorResponse);
        });
        return dfd.promise;
    };

    return DataImportEndpoint;

}];
