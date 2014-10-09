module.exports = ['$resource', 'API_URL', '$rootScope', function($resource, API_URL, $rootScope){

    var ConfigFeaturesData = $resource(API_URL + '/config/features', {}, {
        query: {
            method: 'GET',
            isArray: true,
            transformResponse: function(data /*, header*/) {
                var parsedData = angular.fromJson(data);
                return parsedData.results;
            }
        }
    });

    $rootScope.$on('event:authentication:signout:succeeded', function(){
        ConfigFeaturesData.query();
    });

    return ConfigFeaturesData;

}];
