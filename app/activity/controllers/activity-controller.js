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

    // Set the page title
    $translate('nav.activity').then(function (title) {
        $scope.title = title;
        $scope.$emit('setPageTitle', title);
    });

    var timeScale = d3.time.scale();
    var getDateRange;

    $scope.currentInterval = null;
    $scope.dateRange = null;
    $scope.postTrendData = null;
    $scope.postCategoryData = null;

    //chart options
    $scope.postTrendOptions = {
        isLoading: true,
        height: 250,
        margins: {
            top: 5, right: 20, bottom: 20, left: 50
        },
        x: timeScale,
        yAxis: d3.svg.axis().ticks(3).tickFormat(d3.format('d')).orient('left'),
        xAxis: d3.svg.axis().ticks(5).orient('bottom'),
        renderDataPoints: {
            radius: 3
        },
        brushOn: false,
        keyAccessor: function (d) {
            var date = new Date(parseInt(d.label) * 1000);
            return date;
        },

        elasticY: true,
        valueAccessor: function (d) {
            return d.total;
        }
    };

    $scope.postCategoryOptions = {
        height: 250,
        margins: {
            top: 5, right: 20, bottom: 20, left: 50
        },
        x: d3.scale.ordinal(),
        yAxis: d3.svg.axis().ticks(3).tickFormat(d3.format('d')).orient('left'),
        xUnits: dc.units.ordinal,
        keyAccessor: function (d) {
            return d.label;
        },
        valueAccessor: function (d) {
            return d.total;
        },
        elasticX: true,
        elasticY: true,
        brushOn: false
    };

    /*
    Util func to get date range when given an interval like
    'week', 'month', 'all'
    */
    getDateRange = function (interval) { //interval = week,month,all
        //calculate date range based on the provided interval
        var start = new Date();
        var end = new Date();
        switch (interval) {
        case 'week':
            start = d3.time.week(start); //sunday is the first day of week
            break;
        case 'month':
            start = d3.time.month(new Date()); //get first day of current month
            end = new Date(); //today
            break;
        case 'all':
            start = new Date(2015,0,1); //how do we get the very first post date for this deployment?
            break;
        default:
            //set range to last week as a default
            start = d3.time.week(start);
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
        if ($scope.currentInterval === 'all') {
            startDate = null;
        }

        //queries
        var postsByTimeQuery = {
            'timeline' : 1,
            'timeline_attribute' : 'created',
            'group_by' : '',
            'status': 'all',
            'created_after': startDate,
            'created_before': endDate
        };
        var postsByCategoriesQuery = {
            'group_by': 'tags',
            'order': 'desc',
            'orderby': 'created',
            'status': 'all',
            'created_after': startDate,
            'created_before': endDate
        };
        $scope.mapQuery = {
            'status': 'all',
            'created_after': startDate,
            'created_before': endDate
        };

        //get data for trend chart
        PostEndpoint.stats(postsByTimeQuery).$promise.then(function (results) {
            var data = [];
            if (results.totals.length > 0) {
                data = results.totals[0].values;
                if ($scope.currentInterval === 'all') {
                    /*
                    For ALL TIME period we have to get start date from the
                    first post date when we query for entire duration of deployment
                    */
                    var startDate = new Date(data[0].label * 1000);
                    $scope.dateRange.start = startDate;
                }
                timeScale.domain([$scope.dateRange.start, $scope.dateRange.end]);
            }
            $scope.postTrendOptions.isLoading = false;
            $scope.postTrendData = data;
        });

        //get data for category chart
        PostEndpoint.stats(postsByCategoriesQuery).$promise.then(function (results) {
            var data = [];
            if (results.totals.length > 0) {
                data = results.totals[0].values;
                //show only top 5 categories
                if (data.length > 5) {
                    data = data.slice(0, 5);
                }
            }
            $scope.postCategoryOptions.isLoading = false;
            $scope.postCategoryData = data;
        });

    };

    $scope.update = function (interval) {
        $scope.postCategoryOptions.isLoading = true;
        $scope.postTrendOptions.isLoading = true;
        $scope.currentInterval = interval;
        $scope.dateRange = getDateRange(interval);
        $scope.updateCharts();
    };

    //init
    $scope.update('week');

}];
