module.exports = ['$scope', 'PostData', function($scope, PostData) {
		$scope.title = 'Posts';
		$scope.posts = PostData.query();
}];
