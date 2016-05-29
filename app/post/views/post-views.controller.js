module.exports = PostViewsController;

PostViewsController.$inject = ['$scope', '$translate', '$routeParams', 'PostFilters', '$rootScope'];
function PostViewsController($scope, $translate, $routeParams, PostFilters, $rootScope) {
    // Set view based out route
    $scope.currentView = $routeParams.view;

    // Set the page title
    $translate('post.posts').then(function (title) {
        $scope.title = title;
        $scope.$emit('setPageTitle', title);
    });

    $scope.filters = PostFilters.getFilters();
}
