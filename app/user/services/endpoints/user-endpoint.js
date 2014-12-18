module.exports = [
    '$resource',
    '$rootScope',
    'CONST',
function(
    $resource,
    $rootScope,
    CONST
) {

    var UserEndpoint = $resource(CONST.API_URL + '/users/:id', {
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

    return UserEndpoint;
}];
