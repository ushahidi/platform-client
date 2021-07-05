module.exports = ActivityController;

ActivityController.$inject = [
    '$rootScope',
    '$scope',
    '$translate',
    'moment',
    'Features',
    'Flatpickr'
];

function ActivityController(
    $rootScope,
    $scope,
    $translate,
    moment,
    Features,
    Flatpickr
) {
    // Initial values
    $scope.isActivityAvailable = false;
    $scope.currentInterval = 'all';
    $scope.editableInterval = 'all';
    $scope.filters = {
        created_after: null,
        created_before: null
    };
    $scope.filtersMenuOpen = false;
    Flatpickr('.flatpickr', {});
    $scope.saveFilters = saveFilters;
    $scope.cancelChangeFilters = cancelChangeFilters;
    $scope.targetedSurveysEnabled = false;
    $scope.loggedIn = false;
    $scope.createdAfter = null;
    $scope.createdBefore = null;
    activate();

    function activate() {
        // Change mode
        $scope.$emit('event:mode:change', 'activity');
        // Set the page title
        $translate('nav.activity').then(function (title) {
            $scope.$emit('setPageTitle', title);
        });
        if ($rootScope.loggedin) {
            $scope.loggedIn = true;
        }

        Features.loadFeatures().then(function () {
            $scope.isActivityAvailable = Features.isViewEnabled('activity');
            $scope.targetedSurveysEnabled = Features.isFeatureEnabled(
                'targeted-surveys'
            );
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
                $scope.filters.created_after = moment(
                    moment().startOf('month').toDate()
                )
                    .utc()
                    .format();
                $scope.filters.created_before = null;
                break;
            case 'all':
                $scope.filters.created_after = null;
                $scope.filters.created_before = null;
                break;
            case 'custom':
                if (
                    $scope.createdAfter &&
                    $scope.createdBefore &&
                    $scope.createdAfter.toDateString() ===
                        $scope.createdBefore.toDateString()
                ) {
                    // Do nothing?
                    $scope.filters.created_after = moment(
                        moment($scope.createdAfter).utc()
                    )
                        .startOf('day')
                        .format();
                    $scope.filters.created_before = moment(
                        moment($scope.createdBefore).utc()
                    )
                        .endOf('day')
                        .format();
                }
                if ($scope.createdAfter) {
                    $scope.filters.created_after = moment(
                        moment($scope.createdAfter).utc()
                    )
                        .startOf('day')
                        .format();
                }
                if ($scope.createdBefore) {
                    $scope.filters.created_before = moment(
                        moment($scope.createdBefore).utc()
                    )
                        .startOf('day')
                        .format();
                }
                break;
            // case 'week':
            default:
                // Default to this week
                $scope.filters.created_after = moment(
                    moment().startOf('week').toDate()
                )
                    .utc()
                    .format();
                $scope.filters.created_before = null;
        }
        return $scope.filters;
    }
}
