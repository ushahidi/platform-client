module.exports = ['$resource', 'API_URL', '$rootScope', function($resource, API_URL, $rootScope){

    var ConfigFeaturesEndpoint = $resource(API_URL + '/config/features', {}, {
        get: {
            method: 'GET',
            transformResponse: function(data /*, header*/) {
                var parsedData = angular.fromJson(data);
                delete parsedData['@group'];
                delete parsedData['allowed_methods'];
                return parsedData;
            }
        }
    });

    return ConfigFeaturesEndpoint;

}];
