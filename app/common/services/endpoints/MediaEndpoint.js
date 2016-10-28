module.exports = [
    '$resource',
    '$rootScope',
    'Util',
function (
    $resource,
    $rootScope,
    Util
) {

    var MediaEndpoint = $resource(Util.apiUrl('/media/:id'), {
        id: '@id'
    }, {
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


    return MediaEndpoint;

}];
