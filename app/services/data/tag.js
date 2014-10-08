module.exports = ['$resource', 'API_URL', '$rootScope', function($resource, API_URL, $rootScope){

    var TagData = $resource(API_URL + '/tags/:postId', {}, {
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
        TagData.query();
    });

    return TagData;
}];
