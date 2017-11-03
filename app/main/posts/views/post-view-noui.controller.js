module.exports = PostViewNouiController;

PostViewNouiController.$inject = ['$scope', '$rootScope', '$translate', '$transition$', 'PostFilters'];
function PostViewNouiController($scope, $rootScope, $translate, $transition$, PostFilters) {
    $rootScope.setLayout('layout-embed');
    $scope.filters = PostFilters.getFilters();
    $scope.$emit('event:allposts:show');
}
