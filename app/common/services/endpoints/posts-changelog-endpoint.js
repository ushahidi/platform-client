module.exports = [
    '$resource',
    'Util',
function (
    $resource,
    Util
) {
    //TODO: fix this endpoint to be integrated with the existing POST endpoint?
    var PostsChangeLogEndpoint = $resource(Util.apiUrl('/posts/:post_id/changelog/'), {
        'post_id': '@post_id'
    }, {
        get: {
            method: 'GET',
            params: {
                order: 'desc',
                orderby: 'created'
            }
        }
    });

    return PostsChangeLogEndpoint;
}];
