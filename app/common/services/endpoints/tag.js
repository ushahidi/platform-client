module.exports = [
    '$resource',
    '$rootScope',
    'Util',
    'CacheFactory',
    'TranslationService',
    '$http',
function (
    $resource,
    $rootScope,
    Util,
    CacheFactory,
    TranslationService,
    $http
) {
    var cache;
    if (!(cache = CacheFactory.get('tagCache'))) {
        cache = new CacheFactory('tagCache');
    }


    var TagEndpoint = $resource(Util.apiUrl('/tags/:id'), {
        id: '@id'
    }, {
        query: {
            method: 'GET',
            isArray: true,
            cache: cache,
            transformResponse: function (data /*, header*/) {
                return Util.transformResponse(data).results;
            },
            interceptor: {
                response: (response) => {
                    return TranslationService.getLanguage().then((currentLanguage) => {
                        return response.resource.map((resource) => {
                            return getLocalized(resource, currentLanguage);
                        });
                    });
                }
            }
        },
        save: {
            method: 'POST',
            transformRequest: [
                (data) => {
                    if (data.translations && data.translations.en) {
                        data.tag = data.translations.en.tag;
                        data.description = data.translations.en.description;
                    }
                    return data;
                },
                $http.defaults.transformRequest[0]
            ]
        },
        update: {
            method: 'PUT',
            transformRequest: [
                (data) => {
                    if (data.translations && data.translations.en) {
                        data.tag = data.translations.en.tag;
                        data.description = data.translations.en.description;
                    }
                    return data;
                },
                $http.defaults.transformRequest[0]
            ]
        },
        get: {
            method: 'GET',
            cache: cache,
            params: {'ignore403': '@ignore403'},
            interceptor: {
                response: (response) => {
                    return TranslationService.getLanguage().then((currentLanguage) => {
                        return getLocalized(response.resource, currentLanguage);
                    });
                }
            }
        },
        deleteEntity: {
            method: 'DELETE'
        }
    });

    TagEndpoint.getFresh = function (params) {
        cache.remove(Util.apiUrl('/tags/' + params.id));
        return TagEndpoint.get(params);
    };

    TagEndpoint.queryFresh = function (params) {
        cache.removeAll();
        return TagEndpoint.query(params);
    };

    TagEndpoint.invalidateCache = function () {
        return cache.removeAll();
    };

    TagEndpoint.saveCache = function (item) {
        var persist = item.id ? TagEndpoint.update : TagEndpoint.save;
        cache.removeAll();
        var result = persist(item);
        return result;
    };

    TagEndpoint.delete = function (item) {
        cache.removeAll();
        var result = TagEndpoint.deleteEntity(item);
        return result;
    };


    $rootScope.$on('event:authentication:logout:succeeded', function () {
        TagEndpoint.queryFresh();
    });
    $rootScope.$on('event:authentication:login:succeeded', function () {
        TagEndpoint.queryFresh();
    });

    function getLocalized(resource, currentLanguage) {
        // Ensure we have at least empty translations
        resource.translations = angular.extend(
            {},
            {
                en: {
                    tag: resource.tag,
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

    return TagEndpoint;

}];
