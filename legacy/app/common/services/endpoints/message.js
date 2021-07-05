module.exports = [
    '$resource',
    'Util',
function (
    $resource,
    Util
) {

    var MessageEndpoint = $resource(Util.apiUrl('/messages/:id'), {
        id: '@id'
    }, {
        query: {
            method: 'GET',
            isArray: true,
            transformResponse: function (data /*, header*/) {
                return angular.fromJson(data);
            }
        },
        get: {
            method: 'GET'
        },
        allInThread: {
            method: 'GET',
            params: {
                contact: '@contact',
                offset: '@offset',
                limit: '@limit',
                order: 'asc',
                orderby: 'created'
            },
            isArray: false,
            transformResponse: function (data /*, header*/) {
                return angular.fromJson(data);
            }
        },
        save: {
            method: 'POST'
        }
    });

    return MessageEndpoint;
}];
