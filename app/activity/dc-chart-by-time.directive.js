module.exports = DCChartPostsByTimeDirective;

DCChartPostsByTimeDirective.$inject = [];
function DCChartPostsByTimeDirective() {
    return {
        restrict: 'E',
        scope: {
            dateRange: '='
        },
        controller: DCChartPostsByTimeController,
        templateUrl: 'templates/activity/dc-chart-by-time.html'
    };
}

DCChartPostsByTimeController.$inject = ['$scope', '$rootScope', 'PostEndpoint'];
function DCChartPostsByTimeController($scope, $rootScope, PostEndpoint) {
    var timeScale = d3.time.scale();
    $scope.postTrendData = null;
    // Chart options
    $scope.postTrendOptions = {
        isLoading: true,
        height: 250,
        margins: {
            top: 5, right: 20, bottom: 20, left: 50
        },
        x: timeScale,
        yAxis: d3.svg.axis().ticks(3).tickFormat(d3.format('d')).orient('left'),
        xAxis: d3.svg.axis().ticks(5).orient('bottom'),
        renderDataPoints: {
            radius: 3
        },
        brushOn: false,
        keyAccessor: function (d) {
            var date = new Date(parseInt(d.label) * 1000);
            return date;
        },
        elasticY: true,
        valueAccessor: function (d) {
            return d.total;
        }
    }

    $scope.$watch('dateRange', updateCharts);

    function updateCharts() {
        $scope.postTrendOptions.isLoading = true;

        //queries
        var postsByTimeQuery = {
            'timeline' : 1,
            'timeline_attribute' : 'created',
            'group_by' : '',
            'status': 'all',
            'created_after': $scope.dateRange.start,
            'created_before': $scope.dateRange.end
        };

        //get data for trend chart
        PostEndpoint.stats(postsByTimeQuery).$promise.then(function (results) {
            var data = [];
            if (results.totals.length > 0) {
                data = results.totals[0].values;
                if ($scope.dateRange.start === false) {
                    /*
                    For ALL TIME period we have to get start date from the
                    first post date when we query for entire duration of deployment
                    */
                    var startDate = new Date(data[0].label * 1000);
                    $scope.dateRange.start = startDate;
                }
                timeScale.domain([$scope.dateRange.start, $scope.dateRange.end]);
            }
            $scope.postTrendOptions.isLoading = false;
            $scope.postTrendData = data;
        });
    };

}
