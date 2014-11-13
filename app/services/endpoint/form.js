module.exports = ['$resource', 'API_URL', function($resource, API_URL){

    var FormEndpoint = $resource(API_URL + '/forms/:formId', {}, {
        query: {
            method: 'GET',
            isArray: true,
            transformResponse: function(data /*, header*/) {
                var parsedData = angular.fromJson(data);
                return parsedData.results;
            }
        }
    });

    return FormEndpoint;
}];
