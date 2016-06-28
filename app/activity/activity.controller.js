module.exports = ActivityController;

ActivityController.$inject = ['$scope', '$translate', 'moment', 'Features'];

function ActivityController($scope, $translate, moment, Features) {
    // Initial values
    $scope.isActivityAvailable = false;
    $scope.currentInterval = 'all';
    $scope.editableInterval = 'all';
    $scope.filters = {
        created_after: null,
        created_before: null
    };
    $scope.filtersMenuOpen = false;
    $scope.dateOptions = { format : 'yyyy-mm-dd' };

    $scope.saveFilters = saveFilters;
    $scope.cancelChangeFilters = cancelChangeFilters;

    activate();

    function activate() {
        // Change mode
        $scope.$emit('event:mode:change', 'activity');
        // Set the page title
        $translate('nav.activity').then(function (title) {
            $scope.$emit('setPageTitle', title);
        });

        Features.loadFeatures().then(function () {
            $scope.isActivityAvailable = Features.isViewEnabled('activity');
        });

        update();
    }

    function saveFilters() {
        $scope.currentInterval = $scope.editableInterval;
        update();
        $scope.filtersMenuOpen = false;
    }

    function cancelChangeFilters() {
        $scope.editableInterval = $scope.currentInterval;
        $scope.filtersMenuOpen = false;
    }

    function update() {
        //$scope.currentInterval = interval;
        setDateRange($scope.currentInterval);
    }

    /**
     * Util func to get date range when given an interval like
     * @param  {String} interval month|week|all
     * @return {Object}
     */
    function setDateRange(interval) {
        switch (interval) {
            case 'month':
                $scope.filters.created_after = moment().startOf('month').toDate();
                $scope.filters.created_before =  null;
                break;
            case 'all':
                $scope.filters.created_after = null;
                $scope.filters.created_before =  null;
                break;
            case 'custom':
                // Do nothing?
                $scope.filters.created_after = $scope.createdAfter;
                $scope.filters.created_before = $scope.createdBefore;
                break;
            // case 'week':
            default:
                // Default to this week
                $scope.filters.created_after = moment().startOf('week').toDate();
                $scope.filters.created_before =  null;
        }
        // Copy range to editable values
        $scope.createdAfter = $scope.filters.created_after;
        $scope.createdBefore = $scope.filters.created_before;
        return $scope.filters;
    }
}
