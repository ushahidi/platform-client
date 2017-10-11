module.exports = PostViewsController;

PostViewsController.$inject = ['$scope', '$translate', '$routeParams', 'PostFilters'];
function PostViewsController($scope, $translate, $routeParams, PostFilters) {
    // Set view and layout based out route
    $scope.currentView = $routeParams.view;
    var viewLayouts = {'data': 'd', 'list': 'a', 'map': 'a'};
    $scope.layout = !$routeParams.view ? 'a' : viewLayouts[$routeParams.view];
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
