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
        unLockByPost: unLockByPost,
        getLock: getLock,
        createSocketListener: createSocketListener
    };

    function activate() {

    }

    function createSocketListener() {
        // If logged in subscribe to user lock message channel
        if ($rootScope.currentUser === null) {
            var channel = $rootScope.currentUser + '-lock';
            socket.on(channel, function (data) {
                Notify.error('post.locking.lock_broken_by_other', { user: data.user.realname });
            });
        }
    }

    function unlock(lock) {
        PostLockEndpoint.unlock(lock).$promise.then(function () {
            Notify.success('post.locking.unlocked');
        });
    }

    function unLockByPost(post) {
        PostLockEndpoint.unlockByPost({post_id: post.id}).$promise.then(function () {
            Notify.success('post.locking.unlocked');
        });
    }

    function getLock(post) {
        PostLockEndpoint.unlock({post_id: post.id}).$promise.then(function () {
            Notify.success('post.locking.locked');
        });
    }
}
