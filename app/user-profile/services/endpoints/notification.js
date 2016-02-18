module.exports = [
    '$resource',
    'Util',
function (
    $resource,
    Util
) {

    var NotificationEndpoint = $resource(Util.apiUrl('/notifications/:id'), {
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
            isArray: true,
            // Short term fix to handle boucing to login when unviewable
            // notification is returned
            params: {'ignore403': '@ignore403'},
            transformResponse: function (data) {
                return angular.fromJson(data).results;
            }
        },
        update: {
            method: 'PUT'
        },
        delete: {
            method: 'DELETE'
        }
    });

    return NotificationEndpoint;
}];
