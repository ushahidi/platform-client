module.exports = ['PostEndpoint', 'moment', '_','PostsSdk', function (PostEndpoint, moment, _, PostsSdk) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            key: '=',
            attribute: '=',
            type: '=',
            activeLanguage: '='
        },
        template: require('./post-value.html'),
        link: function ($scope) {
            // This whole directive is wrong and it should feel wrong
            // Depending on whether we are dealing with a post task or a standard task
            // the css class is swapped. This Boolean manages that distinction.
            $scope.standardTask = $scope.type === 'standard';
            $scope.isText = isText;
            function isText() {
                if ($scope.attribute.type === 'varchar' || $scope.attribute.type === 'title' || $scope.attribute.type === 'description' || $scope.attribute.type === 'text' || $scope.attribute.type === 'markdown') {
                    return true;
                }
                return false;
            }
            if ($scope.attribute.type === 'relation') {
                PostsSdk.getPosts($scope.attribute.value.value).then(post=>{
                    $scope.attribute.value.value = post.data.result;
                    $scope.$apply();
                });
            }
            if ($scope.attribute.type === 'datetime') {
                if ($scope.attribute.input === 'date') {
                    $scope.attribute.value.value = moment($scope.attribute.value.value).format('LL');
                }
                if ($scope.attribute.input === 'datetime') {
                    $scope.attribute.value.value = moment($scope.attribute.value.value).format('LLL');
                }
                if ($scope.attribute.input === 'time') {
                    $scope.attribute.value.value = moment($scope.attribute.value.value).format('LT');
                }
            }
        }
    };
}];
