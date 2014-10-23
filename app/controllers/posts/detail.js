module.exports = ['$scope', '$translate', function($scope, $translate) {
    $translate('post.post_details').then(function(postDetailsTranslation){
        $scope.title = postDetailsTranslation;
    });
}];
