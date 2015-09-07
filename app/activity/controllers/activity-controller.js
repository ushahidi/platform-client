module.exports = [
    '$scope',
    '$translate',
    '$routeParams',
    'PostEndpoint',
    'dc',
    'd3',
    '_',
function (
    $scope,
    $translate,
    $routeParams,
    PostEndpoint,
    dc,
    d3,
    _
) {
    // TODO: generic chart component directive that takes a config and a data obj

    // TODO: create a generic tabs component directive with a config like this
    // tabs : {
    //     language: en_json,
    //     onClick: callback
    //     entries: [{
    //         title: 'first tab'
    //         url: ''
    //     },...]
    // }

    // Set the page title
    $translate('nav.activity').then(function (title) {
        $scope.title = title;
        $scope.$emit('setPageTitle', title);
    });

    $scope.currentInterval = null;
    $scope.dateRange = null;
    var timeScale = d3.time.scale();

    //Init charts - these need to be turned into directives
    $scope.postsByTime = dc.lineChart('#posts-by-time');
    $scope.postsByCategories = dc.barChart('#posts-by-categories');

    var getDateRange = function (interval) { //interval = week,month,all
        //calculate date range based on the provided interval
        var start = new Date();
        var end = new Date();
        switch(interval) {
            case 'week':
                start.setDate(start.getDate() - 7);
                break;
            case 'month':
                start = new Date(start.getFullYear(), start.getMonth());
                end = new Date(start.getFullYear(), start.getMonth()+1, 0);
                break;
            case 'all':
                start = new Date(1979,0,1); //how do we get the very first post date for this deployment?
                break;
            default:
                //set range to last week as a default
                start.setDate(start.getDate() - 7);
                break;
        }
        return {
            'start': start,
            'end': end
        };
    };

    $scope.updateCharts = function () {
        //queries
        var postsByTimeQuery = {
            'timeline' : 1,
            'timeline_attribute' : 'created',
            'group_by' : '',
            'status':'all',
            'created_after': $scope.dateRange.start.toISOString(),
            'created_before': $scope.dateRange.end.toISOString()
        };
        var postsByCategoriesQuery = {
            'group_by':'tags',
            'order':'desc',
            'orderby':'created',
            'status':'all',
            'created_after': $scope.dateRange.start.toISOString(),
            'created_before': $scope.dateRange.end.toISOString()
        };
        $scope.mapQuery = {
            'status':'all',
            'created_after': $scope.dateRange.start.toISOString(),
            'created_before': $scope.dateRange.end.toISOString()
        };

        timeScale.domain([$scope.dateRange.start, $scope.dateRange.end]);

        //get data for trend chart and render
        PostEndpoint.stats(postsByTimeQuery).$promise.then( function (results) {
            var data = [];
            if (results.totals.length > 0) {
                data = results.totals[0].values;
            }
            $scope.postsByTime.group().all = function() {
                return data;
                // return [{label:630720000,total:0},{label:946080000,total:100},{label:1419120000,total:0}];
            };
            $scope.postsByTime.render();
        });

        //get data for category chart and render
        PostEndpoint.stats(postsByCategoriesQuery).$promise.then( function (results) {
            var data = [];
            if (results.totals.length > 0) {
                data = results.totals[0].values;
            }
            $scope.postsByCategories.group().all = function () {
                return data;
            };
            $scope.postsByCategories.render();
        });

    };

    $scope.update = function (interval) {
        $scope.currentInterval = interval;
        $scope.dateRange = getDateRange(interval);
        $scope.updateCharts();
    };

    $scope.update('week');

    //configure charts
    //configure postsbytime chart
    $scope.postsByTime
            .height(250)
            .margins({top: 5, right: 5, bottom: 20, left: 50})
            .x(timeScale)
            // .xUnits(d3.time.year)
            .renderArea(true)
            .brushOn(false)
            .renderDataPoints({radius:3})
            // .elasticX(true)
            .elasticY(true)
            .keyAccessor(function(d) {
                var date = new Date(parseInt(d.label) * 1000);
                return date;
            })
            .valueAccessor(function(d) {
                return d.total;
            })
            .dimension({ filterFunction: function() {} })
            .group({ all: function() {
                return []; //
            }})
        ;
    $scope.postsByTime.xAxis().ticks(5).tickFormat(d3.time.format('%b %e, %Y'));
    $scope.postsByTime.yAxis().ticks(3).tickFormat(d3.format('d'));

    //configure the category chart
    //this is alternate way of initializing charts with options in dc.js
    var chartOptions = {
        height: 250,
        margins: {
            top: 5, right: 5, bottom: 20, left: 50
        },
        x: d3.scale.ordinal(),
        xUnits: dc.units.ordinal,
        keyAccessor: function (d) {
            return d.label;
        },
        elasticX: true,
        elasticY: true,
        valueAccessor: function (d) {
            return d.total;
        },
        dimension: {
            filterFunction: function () {} /*NOOP*/
        },
        group: {
            all: function () { return []; }
        }
    };
    $scope.postsByCategories.options(chartOptions);
    $scope.postsByCategories.yAxis().ticks(3).tickFormat(d3.format('d'));

    //should be in chart directive but here for now to debug
    //chart responds to browser resize
    window.onresize = function() {
        $scope.postsByTime
            .width(document.querySelector('#posts-by-time').clientWidth)
            // .height(window.innerHeight-20)
            .rescale()
            .redraw()
        ;
        $scope.postsByCategories
            .width(document.querySelector('#posts-by-categories').clientWidth)
            // .height(window.innerHeight-20)
            .rescale()
            .redraw()
        ;
      };
}];
