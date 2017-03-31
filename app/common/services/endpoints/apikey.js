module.exports = [
    '$resource',
    '$rootScope',
    'Util',
function (
    $resource,
    $rootScope,
    Util
) {

    var ApiKeyEndpoint = $resource(Util.apiUrl('/apikeys'), {
        query: {
            method: 'GET',
            isArray: true,
            transformResponse: function (data /*, header*/) {
                return Util.transformResponse(data).results;
            }
        },
        update: {
            method: 'PUT'
        }
    });

    return ApiKeyEndpoint;

}];
