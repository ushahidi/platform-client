module.exports = PostViewsController;

PostViewsController.$inject = ['$scope', '$translate', '$transition$', 'PostFilters'];
function PostViewsController($scope, $translate, $transition$, PostFilters) {
    // Set view and layout based out route
    $scope.currentView = $transition$.params().view;
    $scope.transitionTo = $transition$.to().name;
    var viewLayouts = {'data': 'd', 'list': 'a', 'map': 'a'};
    $scope.layout = !$transition$.params().view ? 'a' : viewLayouts[$transition$.params().view];
    // Set the page title
    $translate('post.posts').then(function (title) {
        $scope.title = title;
        $scope.$emit('setPageTitle', title);
    });
    PostFilters.setMode('all');
    $scope.filters = PostFilters.getFilters();
    $scope.$emit('event:allposts:show');
    $scope.$on('$destroy', function () {
        $scope.$emit('event:allposts:close');
    });
}
