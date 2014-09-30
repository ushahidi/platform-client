module.exports = ['$resource', 'API_URL', '$rootScope', function($resource, API_URL, $rootScope){

    var PostData = $resource(API_URL + '/posts/:postId', {}, {
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
        PostData.query();
    });

    return PostData;
}];
