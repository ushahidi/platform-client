module.exports = ['$scope', 'TagData', function($scope, TagData) {
        $scope.title = 'Manage Tags';
        $scope.tags = TagData.query();
}];
