module.exports = [
    '$scope',
    '$translate',
    'PostEndpoint',
    'GlobalFilter',
    '_',
function(
    $scope,
    $translate,
    PostEndpoint,
    GlobalFilter,
    _
) {

    $translate('post.posts').then(function(title) {
        $scope.title = title;
        $scope.$emit('setPageTitle', title);
    });

    var getPostsForPagination = function(query) {
        query = query || GlobalFilter.getPostQuery();
        var postQuery = _.extend(query, {
            offset: ($scope.currentPage - 1) * $scope.itemsPerPage,
            limit: $scope.itemsPerPage
        });

        PostEndpoint.query(postQuery).$promise.then(function(postsResponse){
            $scope.posts = postsResponse.results;
            $scope.totalItems = postsResponse.total_count;
        });
    };

    // whenever the GlobalFilter post query changes,
    // update the current list of posts
    $scope.$watch(function() {
        return JSON.stringify(GlobalFilter.getPostQuery());
    }, function(newValue, oldValue) {
        getPostsForPagination();
    });

    $scope.itemsPerPageChanged = function(count) {
        $scope.itemsPerPage = count;
        getPostsForPagination();
    };

    $scope.pageChanged = getPostsForPagination;

    $scope.currentPage = 1;
    $scope.itemsPerPageOptions = [10, 20, 50];
    $scope.itemsPerPage = $scope.itemsPerPageOptions[0];

    // until we have the correct total_count value from backend request:
    $scope.totalItems = $scope.itemsPerPage;

    getPostsForPagination();

}];
