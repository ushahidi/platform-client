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
            // Short term fix to handle boucing to login when unviewable
            // notification is returned
            header: {'ignorable': true},
            transformResponse: function (data) {
                return angular.fromJson(data).results;
            }
        },
        update: {
            method: 'PUT'
        }
    });

    return NotificationEndpoint;
}];
