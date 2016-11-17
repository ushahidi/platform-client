module.exports = ['PostEndpoint', 'moment', function (PostEndpoint, moment) {
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
            // Depending on whether we are dealing with a post task or a standard task
            // the css class is swapped. This Boolean manages that distinction.
            $scope.standardTask = $scope.type === 'standard';
            if ($scope.attribute.type === 'relation') {
                $scope.value = $scope.value.map(function (entry) {
                    return PostEndpoint.get({ id : entry });
                });
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
