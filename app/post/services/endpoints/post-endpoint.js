module.exports = [
    '$resource',
    '$rootScope',
    'CONST',
function(
    $resource,
    $rootScope,
    CONST
) {

    var PostEndpoint = $resource(CONST.API_URL + '/posts/:id', {
        id: '@id'
    }, {
        query: {
            method: 'GET',
            isArray: true,
            transformResponse: function(data /*, header*/) {
                return angular.fromJson(data).results;
            }
        },
        update: {
            method: 'PUT'
        }
    });

    $rootScope.$on('event:authentication:signout:succeeded', function(){
        PostEndpoint.query();
    });

    return PostEndpoint;

}];
