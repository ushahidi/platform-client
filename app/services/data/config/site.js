module.exports = ['$resource', 'API_URL', '$rootScope', function($resource, API_URL, $rootScope){

    var ConfigSiteData = $resource(API_URL + '/config/site', {}, {
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
        ConfigSiteData.query();
    });

    return ConfigSiteData;

}];
