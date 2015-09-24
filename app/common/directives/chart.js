angular.module('ushahidi.common.chart', [])

.directive('dcChart', [
    'dc',
    'd3',
    '$window',
function (
    dc,
    d3,
    $window
) {
    return {
        restrict: 'E',
        scope: {
            chartType: '@chartType',
            options: '=chartOptions',
            data: '=chartData'
        },
        template: '<div class="chart-overlay" ng-show="options.isLoading"><i class="fa fa-refresh fa-4 fa-spin"></i></div><div class="chart-overlay" ng-show="noData && !options.isLoading">No activity during selected period.</div>',
        link: function (scope, iElement, iAttrs) {
            /*
            get constructor based on chart type
            ex: lineChart, barChart etc..
            */
            var chartFactory = dc[scope.chartType];
            // instantiate the chart
            scope.chart = chartFactory(iElement[0]);
            var chart = scope.chart;
            var defaultOptions = {
                dimension: {
                    filterFunction: function () {} /*NOOP*/
                },
                group: {
                    all: function () {
                        return [];
                    } /*NOOP*/
                }
            };

            chart.options(defaultOptions);

            scope.$watch('options', function (newoptions) {
                chart.options(newoptions);
            });

            scope.$watch('data', function (data) {
                if (!data || data.length <= 0) {
                    scope.noData = true;
                    return;
                }
                scope.noData = false;
                /*
                this is how dc.js chart data needs to be updated
                when not using crossfilter
                */
                chart.group().all = function () {
                    return data;
                };
                chart.render();
            });

            var resizeChart = function () {
                if (scope.chartType === 'rowChart') {
                    chart
                        .width(iElement[0].clientWidth)
                        .redraw();
                } else {
                    chart
                        .width(iElement[0].clientWidth)
                        // .height(window.innerHeight-20)
                        .rescale()
                        .redraw();
                }
            };

            chart.on('renderlet', function (_chart) {
                _chart.onClick = function (d) {
                    _chart.filter(null);
                };
            });

            //chart responds to browser resize
            angular.element($window).bind('resize', resizeChart);

            scope.$on('$destroy', function () {
                angular.element($window).unbind('resize', resizeChart);
            });

        }
    };
}]);
