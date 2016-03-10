module.exports = [
    '$scope',
    '$translate',
    '$location',
    '$controller',
    'post',
    'FormEndpoint',
function (
    $scope,
    $translate,
    $location,
    $controller,
    post,
    FormEndpoint
) {
    $scope.activeForm = {};

    $translate('post.edit_post').then(function (title) {
        $scope.title = title;
        $scope.$emit('setPageTitle', title);
    });

    $scope.post = post;

    // Make post tags numeric
    post.tags = post.tags.map(function (tag) {
        return parseInt(tag.id);
    });
    // Ensure completes stages array is numeric
    post.completed_stages = post.completed_stages.map(function (stageId) {
        return parseInt(stageId);
    });

    if (post.form) {
        $scope.activeForm = FormEndpoint.get({ id: post.form.id }, function (form) {
            // Set page title to post title, if there is one available.
            if (post.title && post.title.length) {
                $translate('post.modify.edit_type', { type: form.name, title: post.title }).then(function (title) {
                  $scope.$emit('setPageTitle', title);
              });
            }
        });
    }

}];
