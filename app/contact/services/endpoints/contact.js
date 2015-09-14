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
        get: {
            method: 'GET',
            isArray: true,
            transformResponse: function (data /*, header*/) {
                return angular.fromJson(data).results;
            }
        },
        update: {
            method: 'PUT'
        },
        addContact: {
            method: 'POST',
            url: Util.apiUrl('/contacts')
        }
    });

    return ContactEndpoint;
}];
