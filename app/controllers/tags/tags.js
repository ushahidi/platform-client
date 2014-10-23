module.exports = ['$scope', '$translate', 'TagEndpoint', function($scope, $translate, TagEndpoint) {

    $translate('tag.manage_tags').then(function(manageTagsTranslation){
        $scope.title = manageTagsTranslation;
    });

    $scope.tags = TagEndpoint.query();
}];
