module.exports = PostViewsController;

PostViewsController.$inject = ['$scope', '$translate', '$stateParams', 'PostFilters'];
function PostViewsController($scope, $translate, $stateParams, PostFilters) {
    // Set view and layout based out route
    $scope.currentView = $stateParams.view;
    var viewLayouts = {'data': 'd', 'list': 'a', 'map': 'a'};
    $scope.layout = !$stateParams.view ? 'a' : viewLayouts[$stateParams.view];
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
