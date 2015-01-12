module.exports = [
    '$resource',
    '$rootScope',
    'Util',
function(
    $resource,
    $rootScope,
    Util
) {

    var TagEndpoint = $resource(Util.apiUrl('/tags/:id'), {
            id: '@id'
    }, {
        query: {
            method: 'GET',
            isArray: true,
            transformResponse: function(data /*, header*/) {
                return Util.transformResponse(data).results;
            }
        }
    });

    $rootScope.$on('event:authentication:logout:succeeded', function(){
        TagEndpoint.query();
    });

    return TagEndpoint;

}];
