module.exports = [
    '$resource',
    'Util',
    '_',
function (
    $resource,
    Util,
    _
) {

    var transformAndRemoveId = _.partial(Util.transformResponse, _, ['id']);

    var ConfigEndpoint = $resource(Util.apiUrl('/config/:id'), {
        'id': '@id'
    }, {
        get: {
            method: 'GET',
            transformResponse: transformAndRemoveId
        },
        update: {
            method: 'PUT',
            transformResponse: transformAndRemoveId
        }
    });

    return ConfigEndpoint;

}];
