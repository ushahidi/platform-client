module.exports = ['$scope', 'PostEndpoint', function($scope, PostEndpoint) {
		$scope.title = 'Posts';
		$scope.posts = PostEndpoint.query();
}];
