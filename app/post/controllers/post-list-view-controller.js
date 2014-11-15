module.exports = ['$scope', '$translate', 'PostEndpoint', function($scope, $translate, PostEndpoint) {
	$translate('post.posts').then(function(postsTranslation){
		$scope.title = postsTranslation;
	});
	PostEndpoint.query().$promise.then(function(posts){
		$scope.posts = posts;
	});
}];
