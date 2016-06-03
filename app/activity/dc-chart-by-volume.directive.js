module.exports = DCChartPostsByVolumeDirective;

DCChartPostsByVolumeDirective.$inject = [];
function DCChartPostsByVolumeDirective() {
    return {
        restrict: 'E',
        scope: {
            dateRange: '='
        },
        controller: DCChartPostsByVolumeController,
        templateUrl: 'templates/activity/dc-chart-by-volume.html'
    };
}

DCChartPostsByVolumeController.$inject = ['$scope', '$rootScope', 'PostEndpoint'];
function DCChartPostsByVolumeController($scope, $rootScope, PostEndpoint) {
    var timeScale = d3.time.scale();
    $scope.postCategoryData = null;
    // Post Catgegory Options
    $scope.postCategoryOptions = {
        height: 250,
        margins: {
            top: 5, right: 20, bottom: 20, left: 50
        },
        x: d3.scale.ordinal(),
        yAxis: d3.svg.axis().ticks(3).tickFormat(d3.format('d')).orient('left'),
        xUnits: dc.units.ordinal,
        keyAccessor: function (d) {
            return d.label;
        },
        valueAccessor: function (d) {
            return d.total;
        },
        elasticX: true,
        elasticY: true,
        brushOn: false
    };

    $scope.$watch('dateRange', updateCharts);

    function updateCharts() {
        $scope.postCategoryOptions.isLoading = true;

        //queries
        var postsByCategoriesQuery = {
            'group_by': 'tags',
            'order': 'desc',
            'orderby': 'created',
            'status': 'all',
            'created_after': $scope.dateRange.start,
            'created_before': $scope.dateRange.end
        };

        //get data for category chart
        PostEndpoint.stats(postsByCategoriesQuery).$promise.then(function (results) {
            var data = [];
            if (results.totals.length > 0) {
                data = results.totals[0].values;
                //show only top 5 categories
                if (data.length > 5) {
                    data = data.slice(0, 5);
                }
            }
            $scope.postCategoryOptions.isLoading = false;
            $scope.postCategoryData = data;
        });

    };

}
