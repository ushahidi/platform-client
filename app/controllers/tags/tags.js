module.exports = ['$scope', 'TagEndpoint', function($scope, TagEndpoint) {
        $scope.title = 'Manage Tags';
        $scope.tags = TagEndpoint.query();
}];
