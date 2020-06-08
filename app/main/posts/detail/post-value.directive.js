module.exports = ['PostEndpoint', 'moment', '_','PostsSdk', function (PostEndpoint, moment, _, PostsSdk) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            key: '=',
            value: '=',
            attribute: '=',
            type: '='
        },
        template: require('./post-value.html'),
        link: function ($scope) {
            // This whole directive is wrong and it should feel wrong
            // Depending on whether we are dealing with a post task or a standard task
            // the css class is swapped. This Boolean manages that distinction.
            $scope.standardTask = $scope.type === 'standard';

            if ($scope.attribute.type === 'relation') {
                PostsSdk.getPosts($scope.value).then(post=>{
                    $scope.value = post;
                    $scope.$apply();
                });

            } if ($scope.attribute.type === 'varchar' || $scope.attribute.type === 'title' || $scope.attribute.type === 'description' || $scope.attribute.type === 'text') {
                $scope.value = [$scope.value];
            }
            if ($scope.attribute.type === 'datetime') {
                if ($scope.attribute.input === 'date') {
                    $scope.value = $scope.value.map(function (entry) {
                        return moment(entry).format('LL');
                    });
                }
                if ($scope.attribute.input === 'datetime') {
                    $scope.value = $scope.value.map(function (entry) {
                        return moment(entry).format('LLL');
                    });
                }
                if ($scope.attribute.input === 'time') {
                    $scope.value = $scope.value.map(function (entry) {
                        return moment(entry).format('LT');
                    });
                }
            }
        }
    };
}];
