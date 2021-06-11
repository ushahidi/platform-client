module.exports = ActivityTimeChart;

function ActivityTimeChart() {
    return {
        restrict: 'E',
        scope: {
            filters: '='
        },
        controller: ActivityTimeChartController,
        template: require('./time-chart.html')
    };
}

ActivityTimeChartController.$inject = ['$scope', '$translate', 'PostEndpoint', 'd3', 'Chartist', 'frappe', '_', 'PostFilters'];
function ActivityTimeChartController($scope, $translate, PostEndpoint, d3, Chartist, frappe, _, PostFilters) {

    //===== FRAPPE ======

    $scope.frappeData = {
        labels: ['Sun', 'Mon', 'Tue', 'Wed'],
        datasets: [
            {
                name: 'Draft', type: 'line',
                values: [2, 3, 5, 7]
            },
            {
                name: 'Published', type: 'line',
                values: [1, 2]
            }
        ]
    }

    const chart = new frappe.Chart('#chart', {
        title: 'My Awesome Chart',
        data: $scope.frappeData,
        type: 'axis-mixed', // or 'bar', 'line', 'scatter', 'pie', 'percentage'
        height: 350,
        lineOptions: {
            dotSize: 6 // default: 4
        },
        colors: ['#7cd6fd', '#743ee2']
    });



    //===== CHARTIST ======

    $scope.chartistData =  {
        labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        series: [
            [2, 3, 5, 7],
            [1, 2]

            /* trying out date
            {
                name: 'draft',
                data: [
                  {x: new Date(143134652600), y: 2},
                  {x: new Date(143234652600), y: 3},
                  {x: new Date(143340052600), y: 5},
                  {x: new Date(143366652600), y: 7},
                  {x: new Date(143410652600), y: 8},
                  {x: new Date(143508652600), y: 9}
                ]
            },
            {
                name: 'published',
                data: [
                  {x: new Date(143134652600), y: 1},
                  {x: new Date(143234652600), y: 2}
                ]
            }*/
        ]
    };

    $scope.chartistOptions = {
        width: 400,
        height: 300,
        low: 0,
        fullWidth: true,
        lineSmooth: false,
        // As this is axis specific we need to tell Chartist to use whole numbers only on the concerned axis
        axisY: {
            onlyInteger: true/*,
            offset: 0*/
        }
    }

    // Create a new line chart object where as first parameter we pass in a selector
    // that is resolving to our chart container element. The Second parameter
    // is the actual data object.
    new Chartist.Line('.ct-chart', $scope.chartistData, $scope.chartistOptions);



    //===== D3 ======

    var yAxisLabelCumulative = $translate.instant('graph.cumulative_post_count'),
        yAxisLabel = $translate.instant('graph.new_post_count'),
        xAxisLabel = $translate.instant('graph.post_date');

    $scope.showCumulative = true;
    $scope.isLoading = true;
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
        value: ''
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
            tooltip : {
                contentGenerator: function (data) {
                    return '<h3>' + data.series[0].key + '</h3>' +
                        '<p>' +  data.point.y + ' posts at ' + d3.time.format('%e %b %Y')(new Date(data.point.x)) + '</p>';
                }
            },
            noData: $translate.instant('graph.no_data')
        }
    };

    $scope.reload = getPostStats;

    activate();

    function activate() {
        // whenever filters change, reload
        $scope.$watch('filters', function () {
            getPostStats();
        }, true);
        $scope.$watch('showCumulative', updateAxisLabel);
        PostFilters.setMode('activity');
    }

    function getPostStats(query) {
        query = query || PostFilters.getQueryParams($scope.filters);
        var postQuery = _.extend({}, query, {
            'timeline' : 1,
            'timeline_attribute' : $scope.timelineAttribute,
            'group_by' : $scope.groupBy.value,
            'ignore403': '@ignore403'
        });

        $scope.isLoading = true;
        PostEndpoint.stats(postQuery).$promise.then(function (results) {
            if (!results.totals.length || _.chain(results.totals).pluck('values').pluck('length').max().value() < 3) {
                // Don't render a time chart with less than 3 points
                $scope.data = [{
                    values: []
                }];
            } else {
                $scope.data = results.totals;
            }
            $scope.isLoading = false;
        });
    }

    function updateAxisLabel(cumulative) {
        if (cumulative) {
            $scope.options.chart.yAxis.axisLabel = yAxisLabelCumulative;
        } else {
            $scope.options.chart.yAxis.axisLabel = yAxisLabel;
        }
    }
}
