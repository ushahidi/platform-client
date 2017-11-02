module.exports = PostViewNouiController;

PostViewNouiController.$inject = ['$scope', '$rootScope', '$translate', '$stateParams', 'PostFilters'];
function PostViewNouiController($scope, $rootScope, $translate, $stateParams, PostFilters) {
    $rootScope.setLayout('layout-embed');
    $scope.filters = PostFilters.getFilters();
    $scope.$emit('event:allposts:show');
}
