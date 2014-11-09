module.exports = ['$resource', 'API_URL', function($resource, API_URL){

    var ConfigSiteEndpoint = $resource(API_URL + '/config/site', {}, {
        get: {
            method: 'GET',
            transformResponse: function(data /*, header*/) {
                var parsedData = angular.fromJson(data);
                delete parsedData.id;
                delete parsedData.url;
                delete parsedData.allowed_methods;
                return parsedData;
            }
        }
    });

    return ConfigSiteEndpoint;

}];
