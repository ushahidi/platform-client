module.exports = ActivityController;

ActivityController.$inject = ['$scope', '$translate', 'd3', 'ViewHelper'];

function ActivityController($scope, $translate, d3, ViewHelper) {
    // Initial values
    $scope.isActivityAvailable = false;
    $scope.currentInterval = "week";
    $scope.filters = {
        created_after: null,
        created_before: null
    };
    $scope.filtersMenuOpen = false;

    $scope.saveFilters = saveFilters;
    $scope.cancelChangeFilters = cancelChangeFilters;

    activate();

    function activate () {
        // Change mode
        $scope.$emit('event:mode:change', 'activity');
        // Set the page title
        $translate('nav.activity').then(function (title) {
            $scope.$emit('setPageTitle', title);
        });
        $scope.isActivityAvailable = ViewHelper.isViewAvailable('activity');

        update();
    }

    function saveFilters() {
        update();
        $scope.filtersMenuOpen = false;
    }

    function cancelChangeFilters() {
        $scope.searchForm.$rollbackViewValue();
        $scope.filtersMenuOpen = false;
    }

    function update() {
        //$scope.currentInterval = interval;
        $scope.dateRange = setDateRange($scope.currentInterval);
    }

    /**
     * Util func to get date range when given an interval like
     * @param  {String} interval month|week|all
     * @return {Object}
     */
    function setDateRange(interval) {
        switch (interval) {
            case 'month':
                // todo: convert to JS date
                $scope.filters.created_after = d3.time.month(new Date()).toISOString();
                $scope.filters.created_before =  null;
                break;
            case 'all':
                $scope.filters.created_after = null;
                $scope.filters.created_before =  null;
                break;
            case 'week':
            default:
                // todo: convert to JS date
                $scope.filters.created_after = d3.time.week(new Date()).toISOString();
                $scope.filters.created_before =  null;
        }
        return $scope.filters;
    }
}
