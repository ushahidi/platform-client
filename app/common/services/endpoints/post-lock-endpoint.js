module.exports = [
    '$resource',
    '$rootScope',
    'Util',
    '_',
    '$http',
function (
    $resource,
    $rootScope,
    Util,
    _,
    $http
) {

    var PostLockEndpoint = $resource(Util.apiUrl('/posts/:post_id/lock/'), {
        post_id: '@post_id'
    }, {
        getLock: {
            method: 'PUT'
        },
        unlockByPost: {
            method: 'DELETE'
        },
        unlock: {
            method: 'DELETE'
        },
        options: {
            method: 'OPTIONS'
        }
    });

    return PostLockEndpoint;

}];
