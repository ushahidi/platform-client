module.exports = [
    '$resource',
    '$rootScope',
    'Util',
function(
    $resource,
    $rootScope,
    Util
) {

    var PostEndpoint = $resource(Util.apiUrl('/posts/:postId'), {
        postId: '@postId'
    }, {
        query: {
            method: 'GET',
            isArray: true,
            transformResponse: function(data /*, header*/) {
                return Util.transformResponse(data).results;
            }
        }
    });

    $rootScope.$on('event:authentication:signout:succeeded', function(){
        PostEndpoint.query();
    });

    return PostEndpoint;

}];
