module.exports = PostViewNouiController;

PostViewNouiController.$inject = ['$scope', '$translate', '$routeParams', 'PostFilters'];
function PostViewNouiController($scope, $translate, $routeParams, PostFilters) {
    $scope.filters = PostFilters.getFilters();
    $scope.$emit('event:allposts:show');
}
