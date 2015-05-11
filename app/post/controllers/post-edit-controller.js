module.exports = [
    '$scope',
    '$translate',
    '$location',
    '$routeParams',
    '$controller',
    'PostEndpoint',
    'FormEndpoint',
function (
    $scope,
    $translate,
    $location,
    $routeParams,
    $controller,
    PostEndpoint,
    FormEndpoint
) {
    var that = this;
    // Initialize the base modify controller and extend it.
    angular.extend(this, $controller('PostModifyController', { $scope: $scope }));

    $translate('post.edit_post').then(function (title) {
        $scope.title = title;
        $scope.$emit('setPageTitle', title);
    });

    // Activate editing mode
    $scope.is_edit = true;

    $scope.post_options = $scope.post = PostEndpoint.get({ id: $routeParams.id }, function (post) {
        var tags = [];
        post.tags.map(function (tag) {
            tags.push(parseInt(tag.id));
        });
        post.tags = tags;

        $scope.post = post;
        $scope.active_form = FormEndpoint.get({ formId: post.form.id }, function (form) {
            // Set page title to post title, if there is one available.
            if (post.title && post.title.length) {
                $translate('post.modify.edit_type', { type: form.name, title: post.title }).then(function (title) {
                  $scope.$emit('setPageTitle', title);
              });
            }
        });

        that.fetchAttributes($scope.post.form.id);
    });

    $scope.goBack = function () {
        $location.path('/posts/' + $scope.post.id);
    };

}];
