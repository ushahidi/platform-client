module.exports = [
    '$resource',
    'Util',
    '_',
    'CacheFactory',
    '$rootScope',
    'UserEndpoint',
    'Authentication',
    'Session',
    '$q',
    '$injector',
    '$http',
function (
    $resource,
    Util,
    _,
    CacheFactory,
    $rootScope,
    UserEndpoint,
    Authentication,
    Session,
    $q,
    $injector,
    $http
) {
    var cache;
    if (!(cache = CacheFactory.get('configCache'))) {
        cache = new CacheFactory('configCache', { storageMode : 'memory' });
    }

    var ConfigEndpoint = $resource(Util.apiUrl('/config/:id'), {
        'id': '@id'
    }, {
        get: {
            method: 'GET',
            transformResponse: function (data /*, header*/) {
                return Util.transformResponse(data);
            },
            cache: cache,
            interceptor: {
                response: (response) => {
                    if (response.resource.id !== 'site') {
                        return response.resource;
                    }

                    let TranslationService = $injector.get('TranslationService');
                    return TranslationService.getLanguage(response).then((currentLanguage) => {
                        return getLocalized(response.resource, currentLanguage);
                    });
                }
            }
        },
        update: {
            method: 'PUT',
            transformResponse: function (data /*, header*/) {
                return Util.transformResponse(data);
            },
            transformRequest: [
                (data) => {
                    if (data.id === 'site' && data.translations && data.translations.en) {
                        data.name = data.translations.en.name;
                        data.description = data.translations.en.description;
                    }
                    return data;
                },
                $http.defaults.transformRequest[0]
            ]
        }
    });

    ConfigEndpoint.invalidateCache = function () {
        return cache.removeAll();
    };

    ConfigEndpoint.getFresh = function (params) {
        cache.remove(Util.apiUrl('/config/' + params.id));
        return ConfigEndpoint.get(params);
    };
    /**
     * saveCache is responsible for both creation and update of an entity
     * the switch between update and save is determined based on the presence of
     * the entity's id.
     * When we get a full entity for edit we use getFresh to ensure it's the most
     * up to date. Once the save takes place we need to invalidate the associated:w
     *
     * cache to ensure that the query - where appropriate - is cleared.
     *
     */
    ConfigEndpoint.saveCache = function (item) {
        var persist = item.id ? ConfigEndpoint.update : ConfigEndpoint.save;

        cache.removeAll();
        return persist(item);
    };

    function getLocalized(resource, currentLanguage) {
        // Ensure we have at least empty translations
        resource.translations = angular.extend(
            {},
            {
                en: {
                    name: resource.name,
                    description: resource.description
                },
                ar: {}
            },
            resource.translations
        );

        if (resource.translations) {
            if (resource.translations[currentLanguage]) {
                angular.forEach(resource.translations[currentLanguage], (value, key) => {
                    // Replace original values with translations
                    resource[key] = value;
                });
            }
        }

        return resource;
    }

    return ConfigEndpoint;
}];
