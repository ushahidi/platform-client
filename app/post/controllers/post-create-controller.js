module.exports = [
    '$scope',
    '$translate',
    '$location',
    '$controller',
    'PostEntity',
    'PostEndpoint',
    'FormEndpoint',
    '$routeParams',
function (
    $scope,
    $translate,
    $location,
    $controller,
    postEntity,
    PostEndpoint,
    FormEndpoint,
    $routeParams
) {
    $scope.activeForm = {};

    $translate('post.create_post').then(function (title) {
        $scope.title = title;
        $scope.$emit('setPageTitle', title);
    });

    $scope.post = postEntity();

    if ($routeParams.form) {
        $scope.post.form  = { id: $routeParams.form };
    }

    PostEndpoint.options().$promise.then(function (options) {
        $scope.post.allowed_privileges = options.allowed_privileges;
    });
}];
