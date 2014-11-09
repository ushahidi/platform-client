module.exports = ['$resource', 'API_URL',  function($resource, API_URL){

    var ConfigFeaturesEndpoint = $resource(API_URL + '/config/features', {}, {
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

    return ConfigFeaturesEndpoint;

}];
