module.exports = [
    '$scope',
    '$rootScope',
    '$translate',
    '$filter',
    'PostEndpoint',
    'TagEndpoint',
    'FormEndpoint',
    'FormAttributeEndpoint',
    'GlobalFilter',
    'd3',
    '_',
function(
    $scope,
    $rootScope,
    $translate,
    $filter,
    PostEndpoint,
    TagEndpoint,
    FormEndpoint,
    FormAttributeEndpoint,
    GlobalFilter,
    d3,
    _
) {

    $translate('post.posts').then(function(title) {
        $scope.title = title;
        $rootScope.$emit('setPageTitle', title);
    });

    $scope.options = {
        chart: {
            type: 'multiBarHorizontalChart',
            height: 400,
            margin: {
                top: 20,
                right: 40,
                bottom: 40,
                left: 100
            },
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
            },
            tooltips: false,
            barColor: d3.scale.category20().range()
        }
    };

    $scope.data = [{
        values: []
    }];

    $scope.groupByOptions = {
        'tags' : 'post.categories',
        'form' : 'post.type',
        'status' : 'post.status',
        'attribute' : 'graph.attribute'
    };

    $scope.parentTags = [];
    TagEndpoint.query({parent_id : 0}).$promise.then(function (results) {
        $scope.parentTags = _.filter(results, function (tag) { return ! tag.parent; });
    });

    $scope.attributes = [];
    FormEndpoint.query().$promise.then(function (forms) {
        angular.forEach(forms, function (form) {
            FormAttributeEndpoint.query({formId: form.id}).$promise.then(function (attributes) {
                $scope.attributes = $scope.attributes.concat(attributes);
            });
        });
    });

    var getPostStats = function(query) {
        query = query || GlobalFilter.getPostQuery();
        var postQuery = _.extend(query, {
            'extra' : 'stats',
            'group_by' : $scope.groupBy,
            'group_by_tags' : $scope.groupByTags,
            'group_by_attribute_key' : $scope.attributeKey
        });

        PostEndpoint.get(postQuery).$promise.then(function (results) {
            $scope.options.chart.xAxis.axisLabel = $filter('translate')($scope.groupByOptions[$scope.groupBy]);
            if (results.totals[0]) {
                results.totals[0].key = $scope.options.chart.yAxis.axisLabel;
            }
            $scope.data = results.totals;
        });
    };

    // whenever the GlobalFilter post query changes,
    // update the current list of posts
    $scope.$watch(function() {
        return JSON.stringify(GlobalFilter.getPostQuery());
    }, function(newValue, oldValue) {
        getPostStats();
    });

    $scope.reload = getPostStats;
    $scope.attributeKey = null;
    $scope.groupByTags = null;
    $scope.groupBy = 'tags';
    getPostStats();
}];
