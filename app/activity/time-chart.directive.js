module.exports = ActivityTimeChart;

function ActivityTimeChart() {
    return {
        restrict: 'E',
        // replace: true,
        scope: {
            filters: '=',
            // isLoading: '='
        },
        controller: ActivityTimeChartController,
        templateUrl: 'templates/activity/time-chart.html'
    }
}

ActivityTimeChartController.$inject = ['$scope', '$filter', 'PostEndpoint', 'd3', '_', 'PostFilters'];
function ActivityTimeChartController($scope, $filter, PostEndpoint, d3, _, PostFilters) {
    var yAxisLabelCumulative = $filter('translate')('graph.cumulative_post_count'),
        yAxisLabel = $filter('translate')('graph.new_post_count'),
        xAxisLabel = $filter('translate')('graph.post_date');

    $scope.showCumulative = true;
    $scope.timelineAttribute = 'created';

    $scope.data = [{
        values: []
    }];

    $scope.groupByOptions = {
        '' : 'graph.all_posts',
        'tags' : 'nav.categories',
        'form' : 'app.surveys',
        'status' : 'post.status'
    };

    $scope.groupBy = {
        value: 'tags'
    };

    $scope.options = {
        chart: {
            type: 'lineChart',
            height: 450,
            margin: {
                top: 0,
                right: 65,
                bottom: 40,
                left: 65
            },
            showControls: false,
            x: function (d) {
                return new Date(parseInt(d.label) * 1000);
            },
            y: function (d) {
                return d[$scope.showCumulative ? 'cumulative_total' : 'total'];
            },
            transitionDuration: 500,
            xAxis: {
                axisLabel: xAxisLabel,
                tickFormat: function (d) {
                    //uses unambiguous time format ex: 8 Sep 2014
                    return d3.time.format('%e %b %Y')(new Date(d));
                }
            },
            yAxis: {
                axisLabel: yAxisLabel,
                tickFormat: d3.format('d')
            },
            forceY: 0,
            tooltipContent: function (key, x, y, e, graph) {
                return '<h3>' + key + '</h3>' +
                    '<p>' +  x + '</p>' +
                    '<p>' +  $scope.options.chart.yAxis.axisLabel + ' ' + y + '</p>';
            }
        }
    };

    $scope.reload = getPostStats;

    activate();

    function activate() {
        // whenever filters change, reload
        $scope.$watch('filters', function () { getPostStats() }, true);

        $scope.$watch('showCumulative', updateAxisLabel);
    }

    function getPostStats(query) {
        query = query || PostFilters.getQueryParams($scope.filters);
        var postQuery = _.extend({}, query, {
            'timeline' : 1,
            'timeline_attribute' : $scope.timelineAttribute,
            'group_by' : $scope.groupBy.value
        });

        $scope.isLoading = true;
        PostEndpoint.stats(postQuery).$promise.then(function (results) {
            if (!results.totals.length || results.totals[0].values.length < 3) {
                // Don't render a time chart with less than 3 points
                $scope.data = [{
                    values: []
                }];
            } else {
                $scope.data = results.totals;
            }
            $scope.isLoading = false;
        });
    };

    function updateAxisLabel(cumulative) {
        if (cumulative) {
            $scope.options.chart.yAxis.axisLabel = yAxisLabelCumulative;
        } else {
            $scope.options.chart.yAxis.axisLabel = yAxisLabel;
        }
    }
}
