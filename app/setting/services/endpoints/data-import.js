module.exports = [
    '$resource',
    '$rootScope',
    'Util',
function (
    $resource,
    $rootScope,
    Util
) {

    var DataImportEndpoint = $resource(Util.apiUrl('/csv/:id'), {
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
            method: 'POST'
        }
    });


    return DataEndpoint;

}];
