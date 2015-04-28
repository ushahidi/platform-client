module.exports = [
    '$scope',
    '$rootScope',
    '$translate',
    '$filter',
    'PostEndpoint',
    'GlobalFilter',
    'd3',
    '_',
function(
    $scope,
    $rootScope,
    $translate,
    $filter,
    PostEndpoint,
    GlobalFilter,
    d3,
    _
) {

    $translate('post.posts').then(function(title) {
        $scope.title = title;
        $rootScope.$emit('setPageTitle', title);
    });

    var timeScale = d3.time.scale().nice(d3.time.month); // Using nice() but doesn't appear to do anything

    $scope.options = {
        chart: {
            type: 'lineChart',
            height: 450,
            margin: {
                top: 20,
                right: 40,
                bottom: 40,
                left: 65
            },
            x: function(d){ return new Date(parseInt(d.label)*1000); },
            y: function(d){ return d.cumulative_total; },
            xScale: timeScale,
            transitionDuration: 500,
            xAxis: {
                axisLabel: $filter('translate')('graph.post_date'),
                tickFormat: timeScale.tickFormat(10),
            },
            yAxis: {
                axisLabel: $filter('translate')('graph.post_count'),
                tickFormat: d3.format('d')
            },
            // Remove x from tooltip because we can't get a different foramt from
            // tickFormat ..
            tooltipContent: function(key, x, y, e, graph) {
                return '<h3>' + key + '</h3>' +
                    '<p>' +  y + '</p>';
            }
        }
    };

    $scope.data = [{
        values: []
    }];

    $scope.groupByOptions = {
        '' : 'graph.none',
        'tags' : 'post.categories',
        'form' : 'post.type',
        'status' : 'post.status'
    };

    $scope.reload = function() {
        PostEndpoint.get({
                'extra' : 'stats',
                'timeline' : 1,
                'group_by' : $scope.groupBy
        }).$promise.then(function (results) {
            $scope.data = results.totals;
        });
    };

    $scope.groupBy = '';
    $scope.reload();
}];
