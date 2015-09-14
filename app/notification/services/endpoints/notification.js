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
        addNotification: {
            method: 'POST',
            url: Util.apiUrl('/notifications')
        }
    });

    return NotificationEndpoint;
}];
