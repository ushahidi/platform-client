module.exports = ['PostEndpoint', function (PostEndpoint) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            key: '=',
            value: '=',
            attribute: '=',
            type: '='
        },
        templateUrl: 'templates/posts/post-detail-value.html',
        link: function ($scope) {
            $scope.standardTask = $scope.type === 'standard';
            if ($scope.attribute.type === 'relation') {
                $scope.value = $scope.value.map(function (entry) {
                    return PostEndpoint.get({ id : entry });
                });
            }
        }
    };
}];
