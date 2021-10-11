module.exports = ActivityBarChart;

function ActivityBarChart() {
    return {
        restrict: 'E',
        scope: {
            filters: '='
        },
        controller: ActivityBarChartController,
        template: require('./bar-chart.html')
    };
}

ActivityBarChartController.$inject = ['$scope', '$translate', 'PostEndpoint', 'Chart', '_', 'PostFilters'];
function ActivityBarChartController($scope, $translate, PostEndpoint, Chart, _, PostFilters) {
    $scope.data = [];

    $scope.groupByOptions = {
        'status' : 'post.status',
        'form' : 'app.surveys',
        'tags' : 'nav.categories'
    };

    $scope.groupBy = {
        value: 'status'
    };


    $scope.reload = getPostStats;

    activate();

    function activate() {
        // whenever the filters changes, update the current list of posts
        $scope.$watch('filters', function () {
            getPostStats();
        }, true);
        PostFilters.setMode('activity');
    }

    function getPostStats(query) {
        query = query || PostFilters.getQueryParams($scope.filters);
        var postQuery = _.extend({}, query, {
            'group_by' : $scope.groupBy.value,
            'ignore403': '@ignore403'
        });

        $scope.isLoading = true;
        PostEndpoint.stats(postQuery).$promise.then(function (results) {
            $scope.data = results.totals;
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
        // extracting data from response
        let colour = [];
        return _.map($scope.data, data => {
            let values = _.map(data.values, value => {
                colour.push(getRandomColour());
                return {x: value.label, y: value.total} ;
            });

            return {
                label: data.key,
                data: values,
                borderColor: colour,
                backgroundColor: colour
            };
        });
    }

    function generateGraph() {
        if ($scope.barChart) {
            $scope.barChart.destroy();
        }
        let el = document.getElementById('bar-chart');
        let config = {
            type: 'bar',
            data: {datasets: extractDatasets()},
            options: {
                plugins: {
                    legend:{
                        display: false
                    },
                    tooltip: {
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
                                return context[0].label;
                            },
                            label: function (context) {
                                let text = context.parsed.y > 1 ? 'posts' : 'post';
                                return `${context.formattedValue} ${text}`;
                            }
                        }
                    }
                },
                scales: {
                    y:{
                        ticks: {
                            precision: 0
                        },
                        beginAtZero : true,
                        title: {
                            display: true,
                            text: $translate.instant('graph.post_count')
                        }
                    }
                }
            }
        }
        $scope.barChart = new Chart(el, config);

    }
}
