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
            isArray: false,
            transformResponse: function(data /*, header*/) {
                return angular.fromJson(data);
            }
        },
        update: {
            method: 'PUT'
        }
    });

    return UserEndpoint;
}];
