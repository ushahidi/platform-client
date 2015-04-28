module.exports = [
    '$scope',
    '$rootScope',
    '$translate',
    '$filter',
    'PostEndpoint',
    'GlobalFilter',
    'd3',
function(
    $scope,
    $rootScope,
    $translate,
    $filter,
    PostEndpoint,
    GlobalFilter,
    d3
) {

    $translate('post.posts').then(function(title) {
        $scope.title = title;
        $rootScope.$emit('setPageTitle', title);
    });

    $scope.options = {
        chart: {
            type: 'multiBarHorizontalChart',
            height: 450,
            x: function(d){ return d.label; },
            y: function(d){ return d.total; },
            showValues: true,
            showControls: false,
            valueFormat: d3.format('d'),
            transitionDuration: 500,
            xAxis: {
                axisLabel: $filter('translate')('post.categories')
            },
            yAxis: {
                axisLabel: $filter('translate')('graph.post_count'),
                tickFormat: d3.format('d')
            }
        }
    };

    $scope.data = [{
        values: []
    }];

    $scope.groupByOptions = {
        'tags' : 'post.categories',
        'form' : 'post.type',
        'status' : 'post.status'
    };

    $scope.reload = function() {
        PostEndpoint.get({
                'extra' : 'stats',
                'group_by' : $scope.groupBy
        }).$promise.then(function (results) {
            $scope.options.chart.xAxis.axisLabel = $filter('translate')($scope.groupByOptions[$scope.groupBy]);
            results.totals[0].key = $scope.options.chart.yAxis.axisLabel;
            $scope.data = results.totals;
        });
    };

    $scope.groupBy = 'tags';
    $scope.reload();
}];
