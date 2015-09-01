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

    //queries
    var postsByTimeQuery = {
        'timeline' : 1,
        'timeline_attribute' : 'created',
        'group_by' : ''
    };
    var postsByCategoriesQuery = {
        group_by:'tags',
        order:'desc',
        orderby:'created',
        status:'all'
    };

    //Init charts - all code below will become a generic chart directive
    $scope.postsByTime = dc.lineChart('#posts-by-time');
    $scope.postsByCategories = dc.barChart('#posts-by-categories');

    //configure charts
    //configure postsbytime chart
    $scope.postsByTime
            .height(250)
            .margins({top: 5, right: 5, bottom: 20, left: 50})
            .x(d3.time.scale().domain([new Date(1970,0,1), new Date(2015,10,1)]))
            .xUnits(d3.time.year)
            .renderArea(true)
            .brushOn(false)
            .renderDataPoints({radius:3})
            .keyAccessor(function(d) {
                var date = new Date(d.label * 1000);
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
    $scope.postsByTime.yAxis().ticks(3);
    //get data for chart and render
    PostEndpoint.stats(postsByTimeQuery).$promise.then(function (results) {
        var data = results.totals[0].values;
        $scope.postsByTime.group().all = function() {
            return data;
            // return [{label:630720000,total:0},{label:946080000,total:100},{label:1419120000,total:0}];
        };
        $scope.postsByTime.render();
    });

    //configure the category chart
    //this is alternate way of initialing charts with options in dc.js
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
    $scope.postsByCategories.yAxis().ticks(5);
    //get data for chart and render
    PostEndpoint.stats(postsByCategoriesQuery).$promise.then(function (results) {
        var data = results.totals[0].values;
        $scope.postsByCategories.group().all = function () {
            return data;
        };
        $scope.postsByCategories.render();
    });

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
