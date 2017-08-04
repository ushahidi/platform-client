module.exports = [
    '$scope',
    '$rootScope',
    '$translate',
    '$location',
    '$controller',
    '$routeParams',
    'FormEndpoint',
    'PostEndpoint',
    'Notify',
    '$q',
function (
    $scope,
    $rootScope,
    $translate,
    $location,
    $controller,
    $routeParams,
    FormEndpoint,
    PostEndpoint,
    Notify,
    $q
) {

    $translate('post.edit_post').then(function (title) {
        $scope.title = title;
        $scope.$emit('setPageTitle', title);
    });

    $q.all([
        PostEndpoint.requestLock({id: $routeParams.id}).$promise,
        PostEndpoint.get({ id: $routeParams.id }).$promise
    ]).then(function (results) {
        console.log(results);
        var post = results[1];

        if (!results[0].id) {
            $location.url('/posts/' + post.id);
            if ($rootScope.isAdmin) {
                Notify.confirm('post.break_lock').then(function (result) {
                    PostEndpoint.breakLock({id: post.id}).$promise.then(function (result) {
                        Notify.success('post.lock_broken');
                        $location.url('/posts/' + post.id + '/edit');
                    }, function (error) {
                        Notify.error('post.failed_to_break');
                    });
                }, function () {
                });
            } else {
                Notify.error('post.already_locked');
            }
        }

        // Redirect to view if no edit permissions
        if (post.allowed_privileges.indexOf('update') === -1) {
            $location.url('/posts/' + post.id);
        }

        // Make post tags numeric
        post.tags = post.tags.map(function (tag) {
            return parseInt(tag.id);
        });
        // Ensure completes stages array is numeric
        post.completed_stages = post.completed_stages.map(function (stageId) {
            return parseInt(stageId);
        });

        if (post.form) {
            $scope.form = FormEndpoint.get({ id: post.form.id }, function (form) {
                // Set page title to post title, if there is one available.
                if (post.title && post.title.length) {
                    $translate('post.modify.edit_type', { type: form.name, title: post.title }).then(function (title) {
                        $scope.$emit('setPageTitle', title);
                    });
                }
            });
        } else {
            $location.url('/posts/' + post.id);
        }
        $scope.post = post;
    });
}];
