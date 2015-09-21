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
    $scope.noData = false;
    $scope.isLoading = true;
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
                start = d3.time.week(start); //sunday is the first day of week
                break;
            case 'month':
                start = d3.time.month( new Date() ); //get first day of current month
                end = new Date(); //today
                break;
            case 'all':
                start = new Date(2015,0,1); //how do we get the very first post date for this deployment?
                break;
            default:
                //set range to last week as a default
                start = d3.time.week(start);
                break;
        }
        return {
            'start': start,
            'end': end
        };
    };

    $scope.updateCharts = function () {
        var startDate = $scope.dateRange.start.toISOString();
        var endDate = $scope.dateRange.end.toISOString();
        /*
        when we want data for entire duration of
        deployment we query endpoints without startDate
        */
        if($scope.currentInterval === 'all'){
            startDate = null;
        }
        //queries
        var postsByTimeQuery = {
            'timeline' : 1,
            'timeline_attribute' : 'created',
            'group_by' : '',
            'status':'all',
            'created_after': startDate,
            'created_before': endDate
        };
        var postsByCategoriesQuery = {
            'group_by':'tags',
            'order':'desc',
            'orderby':'created',
            'status':'all',
            'created_after': startDate,
            'created_before': endDate
        };
        $scope.mapQuery = {
            'status':'all',
            'created_after': startDate,
            'created_before': endDate
        };
        //get data for trend chart and render
        PostEndpoint.stats(postsByTimeQuery).$promise.then( function (results) {
            var data = [];
            $scope.isLoading = false;
            if (results.totals.length > 0) {
                $scope.noData = false;
                data = results.totals[0].values;
                if($scope.currentInterval === 'all') {
                    /*
                    For ALL TIME period we have to get start date from the
                    first post date when we query for entire duration of deployment
                    */
                    var startDate = new Date(data[0].label*1000);
                    $scope.dateRange.start = startDate;
                }
                timeScale.domain([$scope.dateRange.start, $scope.dateRange.end]);
            } else {
                $scope.noData = true;
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
        $scope.isLoading = true;
        $scope.noData = false;
        $scope.currentInterval = interval;
        $scope.dateRange = getDateRange(interval);
        $scope.updateCharts();
    };

    $scope.update('week');

    //configure charts
    //configure postsbytime chart
    $scope.postsByTime
            .height(250)
            .margins({top: 5, right: 20, bottom: 20, left: 50})
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
            top: 5, right: 20, bottom: 20, left: 50
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
