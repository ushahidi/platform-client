module.exports = PostViewsControllers;

PostViewsControllers.$inject = ['$scope', '$translate', '$routeParams', 'PostFilters', '$rootScope'];
function PostViewsControllers($scope, $translate, $routeParams, PostFilters, $rootScope) {
    // Change layout class
    $rootScope.setLayout('layout-a');

    // Set view based out route
    $scope.currentView = $routeParams.view;

    // Set the page title
    $translate('post.posts').then(function (title) {
        $scope.title = title;
        $scope.$emit('setPageTitle', title);
    });

    $scope.filters = PostFilters.getFilters();
}
