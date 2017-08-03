module.exports = [
    '$scope',
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
        PostEndpoint.requestLock().$promise,
        PostEndpoint.get({ id: $routeParams.id }).$promise
    ]).then(function (results) {
        console.log(results);
        var post = results[1];

        if (results[0].id) {
            Notify.error('post.already_locked');
            $location.url('/posts/' + post.id);
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
