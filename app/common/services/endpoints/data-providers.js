module.exports = [
    '$resource',
    '$rootScope',
    'Util',
function (
    $resource,
    $rootScope,
    Util
) {

    var DataProviderEndpoint = $resource(Util.apiUrl('/dataproviders/:id'), {
        id: '@id'
    }, {
        query: {
            method: 'GET',
            isArray: false,
            transformResponse: function (data /*, header*/) {
                return angular.fromJson(data);
            }
        },
        options: {
            method: 'OPTIONS'
        }
    });

    return DataProviderEndpoint;

}];
