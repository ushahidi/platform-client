module.exports = ['PostEndpoint', function (PostEndpoint) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            key: '=',
            value: '=',
            attribute: '='
        },
        templateUrl: 'templates/posts/post-detail-value.html',
        link: function ($scope) {
            if ($scope.attribute.type === 'relation') {
                $scope.value = $scope.value.map(function (entry) {
                    return PostEndpoint.get({ id : entry });
                });
            }
        }
    };
}];
