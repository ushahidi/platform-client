module.exports = [
    '$scope',
    '$translate',
    '$location',
    '$controller',
    'PostEntity',
    'PostEndpoint',
    'FormEndpoint',
    'form',
function (
    $scope,
    $translate,
    $location,
    $controller,
    postEntity,
    PostEndpoint,
    FormEndpoint,
    form
) {


    $translate('post.create_post').then(function (title) {
        $scope.title = title;
        $scope.$emit('setPageTitle', title);
    });

    $scope.post = postEntity();    

    PostEndpoint.options().$promise.then(function (options) {
        $scope.post.allowed_privileges = options.allowed_privileges;
    });
}];
