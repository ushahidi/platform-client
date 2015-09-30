module.exports = [
function (
) {
    var controller = [
        '$scope',
        '$filter',
        'PostEndpoint',
        'd3',
        '_',
    function (
        $scope,
        $filter,
        PostEndpoint,
        d3,
        _
    ) {
        var yAxisLabelCumulative = $filter('translate')('graph.cumulative_post_count'),
            yAxisLabel = $filter('translate')('graph.new_post_count'),
            xAxisLabel = $filter('translate')('graph.post_date');

        $scope.posts_query = null;
        $scope.showCumulative = false;
        $scope.timelineAttribute = 'created';
        $scope.groupBy = '';
        $scope.reload = null;
        $scope.data = [{
            values: []
        }];

        $scope.groupByOptions = {
            '' : 'post.posts',
            'tags' : 'post.categories',
            'form' : 'post.type',
            'status' : 'post.status'
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

        var getPostStats = function (query) {
            query = query || $scope.filters;
            var postQuery = _.extend({}, query, {
                'timeline' : 1,
                'timeline_attribute' : $scope.timelineAttribute,
                'group_by' : $scope.groupBy
            });

            $scope.isLoading = true;
            PostEndpoint.stats(postQuery).$promise.then(function (results) {
                $scope.data = results.totals;
                $scope.isLoading = false;
            });
        };

        // whenever filters change, reload
        $scope.$watch(function () {
            return $scope.filters;
        }, function (newValue, oldValue) {
            if (newValue !== oldValue) {
                getPostStats();
            }
        });

        $scope.$watch(function () {
            return $scope.showCumulative;
        }, function (cumulative, oldValue) {
            if (cumulative) {
                $scope.options.chart.yAxis.axisLabel = yAxisLabelCumulative;
            } else {
                $scope.options.chart.yAxis.axisLabel = yAxisLabel;
            }
        });

        // Initial load
        $scope.reload = getPostStats;
        getPostStats();
    }];

    return {
        restrict: 'E',
        replace: true,
        scope: {
            filters: '=',
            isLoading: '='
        },
        controller: controller,
        templateUrl: 'templates/views/timeline.html'
    };
}];
