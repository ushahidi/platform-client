angular.module('e2e-mocks', ['ngMockE2E']).run(function($httpBackend, CONST) {

    $httpBackend.whenPOST(CONST.BACKEND_URL + '/oauth/token').respond(function(method, url, data) {
        var reqPayload = JSON.parse(data);
        if(reqPayload.username === 'admin' && reqPayload.password === 'admin')
        {
            return [200, {
                'access_token':'UmexrkSXVsHeEzGH1TMjYjvX344iB94XZK34nIVw',
                'token_type':'Bearer',
                'expires':2414253574,
                'expires_in':3600,
                'refresh_token':'o1sw8yr6b8BuH00RlIEeLv3v75bzZWZfymquNlKs',
                'refresh_token_expires_in':604800
            }, {}];
        }
        else
        {
          return [400, {
              'error':'invalid_request',
              'error_description':'The user credentials were incorrect.'
          }, {}];
        }
    });

    var apiHandlers = {
        'posts': function(){
            var resource = require('../mocked_backend/api/v2/posts.json');
            return [200, resource, {}];
        },
        'config/features': function(){
            var resource = require('../mocked_backend/api/v2/config/features.json');
            return [200, resource, {}];
        },
        'config/map': function(){
            var resource = require('../mocked_backend/api/v2/config/map.json');
            return [200, resource, {}];
        },
        'users/me': function(){
            var resource = require('../mocked_backend/api/v2/users/me.json');
            return [200, resource, {}];
        },
        'config/site': function(){
            var resource = require('../mocked_backend/api/v2/config/site.json');
            return [200, resource, {}];
        }
    };

    var matcher = new RegExp(CONST.API_URL + '/.*');

    $httpBackend.whenGET(matcher).respond(function(method, url/*, data*/) {
        var resourceName = url.split('api/v2/')[1];
        return apiHandlers[resourceName]();

    });

    $httpBackend.whenPUT(matcher).respond(function(method, url, data){
        return [200, data, {}];
    });

    // pass through all template fetches
    // to the server which delivers the angular app
    $httpBackend.whenGET(/templates.*/).passThrough();
});

angular.module('app').requires.push('e2e-mocks');
