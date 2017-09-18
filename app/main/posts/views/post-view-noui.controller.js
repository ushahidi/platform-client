module.exports = PostViewNouiController;

PostViewNouiController.$inject = ['$scope', '$rootScope', '$translate', '$routeParams', 'PostFilters'];
function PostViewNouiController($scope, $rootScope, $translate, $routeParams, PostFilters) {
    $rootScope.setLayout('layout-embed');
    $scope.filters = PostFilters.getFilters();
    $scope.$emit('event:allposts:show');
}
