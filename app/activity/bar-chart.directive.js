module.exports = ActivityBarChart;

function ActivityBarChart() {
    return {
        restrict: 'E',
        scope: {
            filters: '='
        },
        controller: ActivityBarChartController,
        templateUrl: 'templates/activity/bar-chart.html'
    }
}

ActivityBarChartController.$inject = ['$scope', '$filter', 'PostEndpoint', 'd3', '_', 'PostFilters'];
function ActivityBarChartController($scope, $filter, PostEndpoint, d3, _, PostFilters) {
    $scope.data = [{
        values: []
    }];

    $scope.groupByOptions = {
        'tags' : 'nav.categories',
        'form' : 'app.surveys',
        'status' : 'post.status'
    };

    $scope.groupBy = {
        value: 'tags'
    };

    $scope.options = {
        chart: {
            type: 'multiBarHorizontalChart',
            height: 450,
            margin: {
                top: 0,
                right: 40,
                bottom: 40,
                left: 5
            },
            x: function (d) {
                return d.label;
            },
            y: function (d) {
                return d.total;
            },
            showValues: false,
            showControls: false,
            valueFormat: d3.format('d'),
            transitionDuration: 500,
            xAxis: {
                axisLabel: $filter('translate')('post.categories'),
                tickPadding: -10,
                axisLabelDistance: 0
            },
            yAxis: {
                axisLabel: $filter('translate')('graph.post_count'),
                tickFormat: d3.format('d')
            },
            tooltip : {
                contentGenerator: function (data) {
                    return '<h3>' + data.value + '</h3>' +
                        '<p>' +  data.data.total + '</p>';
                }
            },
            forceY: 0,
            barColor: d3.scale.category20().range()
        }
    };

    $scope.reload = getPostStats;
    $scope.setGroupBy = setGroupBy;

    activate();

    function activate() {
        // whenever the filters changes, update the current list of posts
        $scope.$watch('filters', function () {
            getPostStats();
        }, true);
    }

    function getPostStats(query) {
        query = query || PostFilters.getQueryParams($scope.filters);
        var postQuery = _.extend({}, query, {
            'group_by' : $scope.groupBy.value
        });

        $scope.isLoading = true;
        PostEndpoint.stats(postQuery).$promise.then(function (results) {
            $scope.options.chart.xAxis.axisLabel = $filter('translate')($scope.groupByOptions[$scope.groupBy.value]);
            if (results.totals[0]) {
                results.totals[0].key = $scope.options.chart.yAxis.axisLabel;
            }
            $scope.data = results.totals;
            $scope.isLoading = false;
        });
    }

    function setGroupBy(key) {
        $scope.groupBy.value = key;
        getPostStats();
    }

}
