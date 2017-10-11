module.exports = PostLockService;

PostLockService.$inject = [
    '$rootScope',
    '_',
    'PostLockEndpoint',
    '$q',
    'socket',
    'Notify'
];
function PostLockService(
    $rootScope,
    _,
    PostLockEndpoint,
    $q,
    socket,
    Notify
) {

    activate ();

    return {
        unlock: unlock,
        unlockByPost: unlockByPost,
        getLock: getLock,
        createSocketListener: createSocketListener
    };

    function activate() {

    }

    function createSocketListener() {
        // If logged in subscribe to user lock message channel
        if ($rootScope.currentUser !== null) {
            if (socket.init()) {
                var channel = $rootScope.currentUser.userId + '-lock';
                socket.on(channel, function (data) {
                    Notify.error('post.locking.lock_broken_by_other');
                });
            }
        }
    }

    function unlock(lock) {
        PostLockEndpoint.unlock(lock).$promise.then(function () {
            Notify.success('post.locking.unlocked');
        }, handleFailure);
    }

    function unlockByPost(post) {
        var deferred = $q.defer();

        PostLockEndpoint.unlockByPost({post_id: post.id}).$promise.then(function () {
            Notify.success('post.locking.unlocked');
            deferred.resolve();
        }, function (errorResponse) {
            handleFailure(errorResponse);
            deferred.reject(errorResponse);
        });

        return deferred.promise;
    }

    function getLock(post) {
        PostLockEndpoint.unlock({post_id: post.id}).$promise.then(function () {
            Notify.success('post.locking.locked');
        }, handleFailure);
    }

    function handleFailure(errorResponse) {
        Notify.apiErrors(errorResponse);
    }
}
