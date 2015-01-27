module.exports = ['$scope', '$translate', 'PostEndpoint', function($scope, $translate, PostEndpoint) {
	$translate('post.posts').then(function(postsTranslation){
		$scope.title = postsTranslation;
	});

	// --- start: definitions
	var getPostsForPagination = function(){
		PostEndpoint.query({
			offset: ($scope.currentPage - 1) * $scope.itemsPerPage,
			limit: $scope.itemsPerPage
		}).$promise.then(function(postsResponse){
			$scope.posts = postsResponse.results;
			$scope.totalItems = postsResponse.total_count;
		});
	};

    $scope.itemsPerPageChanged = function(count) {
        $scope.itemsPerPage = count;
        getPostsForPagination();
    };

	$scope.pageChanged = getPostsForPagination;
	// --- end: definitions


	// --- start: initialization
	$scope.currentPage = 1;
	$scope.itemsPerPageOptions = [10, 20, 50];
	$scope.itemsPerPage = $scope.itemsPerPageOptions[0];
	// untill we have the correct total_count value from backend request:
	$scope.totalItems = $scope.itemsPerPage;

	getPostsForPagination();
	// --- end: initialization

}];
