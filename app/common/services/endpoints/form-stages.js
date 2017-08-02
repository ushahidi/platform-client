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

    if (!(cache = CacheFactory.get('stageCache'))) {
        cache = new CacheFactory('stageCache');
    }

    var FormStageEndpoint = $resource(Util.apiUrl('/forms/:formId/stages/:id'), {
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

    FormStageEndpoint.getFresh = function (params) {
        cache.remove(Util.apiUrl('/forms/' + params.formId + '/stages/' + params.id));
        return FormStageEndpoint.get(params);
    };

    FormStageEndpoint.invalidateCache = function () {
        return cache.removeAll();
    };

    FormStageEndpoint.queryFresh = function (params) {
        cache.removeAll();
        return FormStageEndpoint.query(params);
    };

    FormStageEndpoint.saveCache = function (item) {
        var persist = item.id ? FormStageEndpoint.update : FormStageEndpoint.save;
        cache.removeAll();
        var result = persist(item);
        return result;
    };

    FormStageEndpoint.delete = function (item) {
        cache.removeAll();
        return FormStageEndpoint.deleteEntity(item);
    };

    function getLocalized(resource, currentLanguage) {
        // Ensure we have at least empty translations
        resource.translations = angular.extend(
            {},
            {
                en: {
                    label: resource.label,
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

    return FormStageEndpoint;
}];
