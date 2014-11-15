module.exports = ['$resource', 'API_URL', function($resource, API_URL){

    var FormAttributeEndpoint = $resource(API_URL + '/attributes/:id', {
        id: '@id'
    }, {
        query: {
            method: 'GET',
            isArray: true,
            transformResponse: function(data /*, header*/) {
                var parsedData = angular.fromJson(data);
                return parsedData.results;
            }
        }
    });

    return FormAttributeEndpoint;
}];
