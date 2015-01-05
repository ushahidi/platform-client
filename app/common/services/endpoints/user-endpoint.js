module.exports = [
    '$resource',
    '$rootScope',
    'Util',
function(
    $resource,
    $rootScope,
    Util
) {
    var UserEndpoint = $resource(Util.apiUrl('/users/:id'), {
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
