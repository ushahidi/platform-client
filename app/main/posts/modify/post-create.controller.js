module.exports = [
    '$scope',
    '$translate',
    '$location',
    '$controller',
    '$transition$',
    'PostEntity',
    'PostEndpoint',
    'SurveysSdk',
function (
    $scope,
    $translate,
    $location,
    $controller,
    $transition$,
    postEntity,
    PostEndpoint,
    SurveysSdk
) {
    $translate('post.create_post').then(function (title) {
        $scope.title = title;
        $scope.$emit('setPageTitle', title);
    });

    $scope.post = postEntity();

    PostEndpoint.options().$promise.then(function (options) {
        $scope.post.allowed_privileges = options.allowed_privileges;
    });
    $scope.formId = $transition$.params().id;
}];
