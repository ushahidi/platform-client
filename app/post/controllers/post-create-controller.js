module.exports = [
    '$scope',
    '$translate',
    '$location',
    '$controller',
    '$route',
    'PostEntity',
    'PostEndpoint',
    'FormEndpoint',
function (
    $scope,
    $translate,
    $location,
    $controller,
    $route,
    postEntity,
    PostEndpoint,
    FormEndpoint
) {


    $translate('post.create_post').then(function (title) {
        $scope.title = title;
        $scope.$emit('setPageTitle', title);
    });

    $scope.post = postEntity();

    PostEndpoint.options().$promise.then(function (options) {
        $scope.post.allowed_privileges = options.allowed_privileges;
    });
    $scope.form = FormEndpoint.get({ id: $route.current.params.id }).$promise;
}];
