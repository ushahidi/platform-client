module.exports = [
function (
) {
    var controller = [
        '$scope',
        '$filter',
        'PostEndpoint',
        'TagEndpoint',
        'FormEndpoint',
        'FormAttributeEndpoint',
        'd3',
        '_',
    function (
        $scope,
        $filter,
        PostEndpoint,
        TagEndpoint,
        FormEndpoint,
        FormAttributeEndpoint,
        d3,
        _
    ) {
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
                x: function (d) {
                    return new Date(parseInt(d.label) * 1000);
                },
                y: function (d) {
                    return d[$scope.showCumulative ? 'cumulative_total' : 'total'];
                },
                xScale: timeScale,
                transitionDuration: 500,
                xAxis: {
                    axisLabel: $filter('translate')('graph.post_date'),
                    tickFormat: timeScale.tickFormat(10)
                },
                yAxis: {
                    axisLabel: $filter('translate')('graph.post_count'),
                    tickFormat: d3.format('d')
                },
                // Remove x from tooltip because we can't get a different foramt from
                // tickFormat ..
                tooltipContent: function (key, x, y, e, graph) {
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
            'status' : 'post.status',
            'attribute' : 'graph.attribute'
        };

        $scope.parentTags = [];
        TagEndpoint.query({parent_id : 0}).$promise.then(function (results) {
            $scope.parentTags = _.filter(results, function (tag) {
                return !tag.parent;
            });
        });

        $scope.attributes = [];
        $scope.time_attributes = [
            { key: 'created', label: $filter('translate')('graph.created') },
            { key: 'updated', label: $filter('translate')('graph.updated') }
        ];
        FormEndpoint.query().$promise.then(function (forms) {
            angular.forEach(forms, function (form) {
                FormAttributeEndpoint.query({formId: form.id}).$promise.then(function (attributes) {
                    $scope.attributes = $scope.attributes.concat(attributes);
                    $scope.time_attributes = $scope.time_attributes.concat(
                        _.filter(attributes, function (attr) {
                            return attr.type === 'datetime';
                        })
                                       );
                });
            });
        });

        var updateData = function (data, interval) {
            var first = _.min(_.pluck(_.map(data, function (series) {
                    return _.first(series.values);
                }), 'label')),
                last = _.max(_.pluck(_.map(data, function (series) {
                    return _.last(series.values);
                }), 'label'))
                ;

            $scope.data = _.map(data, function (series, index) {
                var // Create object of { time:total } pairs
                    indexedValues = _.object(_.pluck(series.values, 'label'), _.pluck(series.values, 'total')),
                    cumulativeTotal = 0,
                    values = []
                    ;

                for (var time = first; time <= last; time += interval) {
                    var value;
                    if (typeof indexedValues[time] !== 'undefined') {
                        value =  indexedValues[time];
                    } else {
                        value = 0;
                    }
                    cumulativeTotal = cumulativeTotal + value;
                    values.push({
                        'total' : value,
                        'label' : time,
                        'cumulative_total': cumulativeTotal
                    });
                }

                return {
                    key: series.key,
                    values: values
                };
            });
        };

        var getPostStats = function (query) {
            query = query || $scope.filters;
            var postQuery = _.extend(query, {
                'timeline' : 1,
                'timeline_attribute' : $scope.timelineAttribute,
                'group_by' : $scope.groupBy,
                'group_by_tags' : $scope.groupByTags,
                'group_by_attribute_key' : $scope.attributeKey
            });

            $scope.isLoading = true;
            PostEndpoint.stats(postQuery).$promise.then(function (results) {
                updateData(results.totals, results.time_interval);
                $scope.isLoading = false;
            });
        };

        // whenever filters change, reload
        $scope.$watch(function () {
            return $scope.filters;
        }, function (newValue, oldValue) {
            getPostStats();
        });

        // Initial values
        $scope.showCumulative = true;
        $scope.timelineAttribute = 'created';
        $scope.attributeKey = null;
        $scope.groupByTags = null;
        $scope.groupBy = '';

        // initial load
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
