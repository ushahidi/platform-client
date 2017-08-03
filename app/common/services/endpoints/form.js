module.exports = [
    '$resource',
    'Util',
    'CacheFactory',
    'TranslationService',
    '$http',
function (
    $resource,
    Util,
    CacheFactory,
    TranslationService,
    $http
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
        get: {
            method: 'GET',
            cache: cache,
            interceptor: {
                response: (response) => {
                    return TranslationService.getLanguage().then((currentLanguage) => {
                        return getLocalized(response.resource, currentLanguage);
                    });
                }
            }
        },
        save: {
            method: 'POST',
            transformRequest: [
                (data) => {
                    if (data.translations && data.translations.en) {
                        data.name = data.translations.en.name;
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
                        data.name = data.translations.en.name;
                        data.description = data.translations.en.description;
                    }
                    return data;
                },
                $http.defaults.transformRequest[0]
            ]
        },
        deleteEntity: {
            method: 'DELETE'
        }
    });

    FormEndpoint.getFresh = function (params) {
        cache.remove(Util.apiUrl('/forms/' + params.id));
        return FormEndpoint.get(params);
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

        if (resource.translations[currentLanguage]) {
            angular.forEach(resource.translations[currentLanguage], (value, key) => {
                // Replace original values with translations
                resource[key] = value;
            });
        }

        return resource;
    }


    return FormEndpoint;

}];
