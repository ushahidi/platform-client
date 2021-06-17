require('angular-mocks/angular-mocks');
angular.module('e2e-mocks', ['ngMockE2E'])
    .run(['$httpBackend', 'CONST', 'URI', '_', function ($httpBackend, CONST, URI, _) {

        var resourceToJsonMapping = {
            'posts': require('../mocked_backend/api/v3/posts.json'),
            'forms': require('../mocked_backend/api/v3/forms.json'),
            'forms/1': require('../mocked_backend/api/v3/forms/1.json'),
            'forms/3': require('../mocked_backend/api/v3/forms/3.json'),
            'forms/1/stages': require('../mocked_backend/api/v3/stages.json'),
            'forms/1/stages/4': require('../mocked_backend/api/v3/stages/4.json'),
            'forms/1/attributes': require('../mocked_backend/api/v3/attributes.json'),
            'sets': require('../mocked_backend/api/v3/sets.json'),
            'collections': require('../mocked_backend/api/v3/collections.json'),
            'roles': require('../mocked_backend/api/v3/roles.json'),
            'users': require('../mocked_backend/api/v3/users.json'),
            'users/me': require('../mocked_backend/api/v3/users/me.json'),
            'config/site': require('../mocked_backend/api/v3/config/site.json'),
            'config/map': require('../mocked_backend/api/v3/config/map.json'),
            'config/features': require('../mocked_backend/api/v3/config/features.json'),
            'config': require('../mocked_backend/api/v3/config.json'),
            'tags': require('../mocked_backend/api/v3/tags.json')
        },

        getResultForResource = function (resourceName, offset, limit) {
            var resource = _.clone(resourceToJsonMapping[resourceName]);
            // If we have no mapping for resourceName, return 500
            if (!resource) {
                return [500, {}, {}];
            }

            // if we have a collection
            if (resource.results) {
                resource.results = resource.results.slice(offset, offset + limit);
            }
            return [200, resource, {}];
        },

        matcher = new RegExp(CONST.API_URL + '/.*');

        $httpBackend.whenPOST(CONST.BACKEND_URL + '/oauth/token').respond(function (method, url, data) {
            var reqPayload = JSON.parse(data);
            if (reqPayload.grant_type === 'password' && reqPayload.username === 'admin@ush.com' && reqPayload.password === 'admin') {
                return [200, {
                    'access_token': 'UmexrkSXVsHeEzGH1TMjYjvX344iB94XZK34nIVw',
                    'token_type': 'Bearer',
                    'expires': 2414253574,
                    'expires_in': 3600,
                    'refresh_token': 'o1sw8yr6b8BuH00RlIEeLv3v75bzZWZfymquNlKs',
                    'refresh_token_expires_in': 604800
                }, {}];
            } else if (reqPayload.grant_type === 'client_credentials') {
                return [200, {
                    'access_token': 'UmexrkSXVsHeEzGH1TMjYjvX344iB94XZK34nIVw',
                    'token_type': 'Bearer',
                    'expires': 2414253574,
                    'expires_in': 3600,
                    'refresh_token': 'o1sw8yr6b8BuH00RlIEeLv3v75bzZWZfymquNlKs',
                    'refresh_token_expires_in': 604800
                }, {}];
            } else {
                return [400, {
                    'error': 'invalid_request',
                    'error_description': 'The user credentials were incorrect.'
                }, {}];
            }
        });

        $httpBackend.whenGET(matcher).respond(function (method, url/*, data*/) {
            var uri = URI(url),
                queryParams = uri.query(true),
                offset = parseInt(queryParams.offset) || 0,
                limit = parseInt(queryParams.limit) || Infinity,
                resourceName = uri.path().split('api/v3/')[1];

            return getResultForResource(resourceName, offset, limit);
        });

        $httpBackend.whenPOST(matcher).respond(function (method, url, data) {
            if (url.contains('forms/1/stages')) {
                return getResultForResource('forms/1/stages/4');
            }
            if (url.contains('forms')) {
                return getResultForResource('forms/3');
            }
            return [200, data, {}];
        });

        $httpBackend.whenPUT(matcher).respond(function (method, url, data) {
            return [200, data, {}];
        });

        // pass through all template fetches
        // to the server which delivers the angular app
        $httpBackend.whenGET(/templates.*/).passThrough();

        $httpBackend.whenDELETE(matcher).respond(function (method, url, data) {
            return [200, data, {}];
        });
    }]);

angular.module('app').requires.push('e2e-mocks');
