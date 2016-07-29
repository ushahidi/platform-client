module.exports = [
    '$resource',
    'Util',
    '_',
function (
    $resource,
    Util,
    _
) {

    var ContactEndpoint = $resource(Util.apiUrl('/contacts/:id'), {
        id: '@id'
    }, {
        query: {
            method: 'GET',
            isArray: true,
            transformResponse: function (data /*, header*/) {
                return angular.fromJson(data).results;
            }
        },
        get: {
            method: 'GET',
            params: {'ignore403': '@ignore403'}
        },
        update: {
            method: 'PUT'
        }
    });

    return ContactEndpoint;
}];
