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

ActivityTimeChartController.$inject = ['$scope', '$translate', 'PostEndpoint', 'Chart', '_', 'PostFilters', 'dayjs'];
function ActivityTimeChartController($scope, $translate, PostEndpoint, Chart, _, PostFilters, dayjs) {
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
                $scope.data = [];
            } else {
                $scope.data = results.totals;
            }
            generateGraph();
            $scope.isLoading = false;
        });
    }

    function getRandomColour() {
        let letters = '0123456789ABCDEF'.split('');
        let colour = '#';
        for (let i = 0; i < 6; i++) {
            colour += letters[Math.floor(Math.random() * 16)];
        }
        return colour;
    }

    function extractDatasets () {
        // defining colours for known datasets (corresponds to the pattern-library basic colours)
        let colours = {
            all: '#2274b4',
            draft: '#2274b4',
            published: '#4fab2f',
            archived: '#de0000'
        };

        // extracting data from response
        return _.map($scope.data, data => {
            let values = _.map(data.values, value => {
                return $scope.showCumulative ?  {x: value.label, y: value.cumulative_total} : {x: value.label, y: value.total} ;
            });
            // setting the colour
            let colour = colours[data.key] ? colours[data.key] : getRandomColour();

            return {
                label: data.key,
                data: values,
                borderColor: colour,
                backgroundColor: colour
            };
        });
    }

    function generateGraph() {
        if ($scope.timeChart) {
            $scope.timeChart.destroy();
        }

        if ($scope.data.length > 0) {
        let el = document.getElementById('time-chart');

        let config = {
            type: 'line',
            data: {datasets: extractDatasets()},
            options: {
                plugins: {
                    tooltip:{
                        enabled: true,
                        // colours corresponds to Pattern Library basic colours.
                        backgroundColor: '#FAFAFA',
                        borderColor: '#1D232A',
                        titleColor: '#1D232A',
                        bodyColor: '#1D232A',
                        displayColors: false,
                        // creating tooltip-content
                        callbacks: {
                            title: function(context) {
                                return context[0].dataset.label
                            },
                            label: function (context) {
                                let date = dayjs(new Date(context.parsed.x * 1000)).format('DD MM YY');
                                let text = context.parsed.y > 1 ? 'posts on' : 'post on';
                                return `${context.parsed.y} ${text} ${date}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        type: 'linear',
                        ticks: {
                            source: 'data',
                            // setting unit-labels for x-axis
                            callback: function(value) {
                            let d = new Date(value * 1000)
                                return dayjs(d).format('D MMM YY')
                            }
                        },
                        // setting label for x-axis
                        title: {
                            display: true,
                            text: xAxisLabel
                        }
                    },
                    y: {
                        ticks: {
                            precision: 0
                        },
                        beginAtZero : true,
                        // setting label for y-axis
                        title: {
                            display: true,
                            text: $scope.showCumulative ? yAxisLabelCumulative : yAxisLabel
                        }
                    }
                }
            }
        };
            $scope.timeChart = new Chart(el, config);
        }
    }

    function updateAxisLabel(cumulative) {
        if ($scope.timeChart && $scope.timeChart.config) {
            $scope.timeChart.config.options.scales.y.title.text =  cumulative ? yAxisLabelCumulative : yAxisLabel;
            $scope.timeChart.update();
        }
    }
}
