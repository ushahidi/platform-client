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

    if (!(cache = CacheFactory.get('attrCache'))) {
        cache = new CacheFactory('attrCache');
    }

    var FormAttributeEndpoint = $resource(Util.apiUrl('/forms/:formId/attributes/:id'), {
        formId: '@formId',
        id: '@id'
    }, {
        query: {
            method: 'GET',
            isArray: true,
            params: {
                order: 'asc',
                orderby: 'priority'
            },
            transformResponse: function (data /*, header*/) {
                return Util.transformResponse(data).results;
            },
            cache: cache,
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
        update: {
            method: 'PUT',
            transformRequest: [
                (data) => {
                    if (data.translations && data.translations.en) {
                        data.label = data.translations.en.label;
                        data.instructions = data.translations.en.instructions;
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

    FormAttributeEndpoint.getFresh = function (params) {
        cache.remove(Util.apiUrl('/forms/' + params.formId + '/attributes/' + params.id));
        return FormAttributeEndpoint.get(params);
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

    FormAttributeEndpoint.invalidateCache = function () {
        return cache.removeAll();
    };

    FormAttributeEndpoint.delete = function (item) {
        cache.removeAll();
        return FormAttributeEndpoint.deleteEntity(item);
    };

    function getLocalized(resource, currentLanguage) {
        // Ensure we have at least empty translations
        resource.translations = angular.extend(
            {},
            {
                en: {
                    label: resource.label,
                    instructions: resource.instructions
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

    return FormAttributeEndpoint;
}];
