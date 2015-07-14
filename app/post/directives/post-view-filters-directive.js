module.exports = [
    'Geocoding',
    'GlobalFilter',
    '$rootScope',
function (
    Geocoding,
    GlobalFilter,
    $rootScope
) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            halfWidth: '=',
            isLoading: '='
        },
        templateUrl: 'templates/partials/post-view-filters.html',
        link: function ($scope, $element, $attrs) {
            $scope.filter = {};
            $scope.globalFilter = GlobalFilter;
            $scope.startDateOpen = false;
            $scope.endDateOpen = false;
            $scope.showFilterControls = false;

            $scope.geocodingBusy = false;

            $scope.isAdmin = $rootScope.isAdmin;

            // Filter bound through $scope.filter
            // Other filters are bound directly to GlobalFilter (tags, post type, etc)
            var available_filters = [
                'q', 'start_date', 'end_date', 'center_point', 'within_km', 'status'
            ],

            filter_transform = {
                center_point: function () {
                    var location = $scope.filter.center_point,
                        valid_coords = /\-?[0-9]+(\.[0-9]+)?\s*,\s*\-?[0-9]+(\.[0-9]+)?/;

                    if (valid_coords.test(location)) {
                        // if the location is already a lat/lon, pass it through
                        GlobalFilter.center_point = location;
                    } else { // perform a geocoding lookup on the location
                        $scope.geocodingBusy = true;

                        Geocoding.search(location).then(function (coordinates) {
                            if (!coordinates) {
                                return;
                            } // @todo - handle bad lookup
                            GlobalFilter.center_point = coordinates[0] + ',' + coordinates[1];
                            $scope.geocodingBusy = false;
                        });
                    }
                }
            },

            resetFilters = function () {
                $scope.filter = {};
                angular.forEach(available_filters, function (key) {
                    if (GlobalFilter[key]) {
                        $scope.filter[key] = GlobalFilter[key];
                    }
                });
            };
            // initialize local filters
            resetFilters();

            $scope.applyFilter = function () {
                angular.forEach(available_filters, function (key) {
                    if ($scope.filter[key]) { // apply each filter with a value
                        if (filter_transform[key]) { // special cases
                            filter_transform[key]();
                        } else { // otherwise update the global filter
                            GlobalFilter[key] = $scope.filter[key];
                        }
                    } else { // filters with no value are removed
                        delete GlobalFilter[key];
                    }
                });
            };

            $scope.clearFilters = function () {
                GlobalFilter.clearSelected();
                resetFilters();
            };

            $scope.showAllTagsHandler = function () {
                if (this.showAllTags) {
                    GlobalFilter.tags = [];
                }
            };

            $scope.showAllFormsHandler = function () {
                if (this.showAllForms) {
                    GlobalFilter.form = [];
                }
            };

            $scope.showAllPostStagesHandler = function () {
                if (this.showAllPostStages) {
                    GlobalFilter.current_stage = [];
                }
            };

            $scope.showAllCollectionsHandler = function () {
                if (this.showAllCollections) {
                    GlobalFilter.set = [];
                }
            };

            $scope.uiOpenDate = function (datepicker) {
                if (datepicker === 'start_date') {
                    $scope.start_date_open = true;
                } else if (datepicker === 'end_date') {
                    $scope.end_date_open = true;
                }

                return false;
            };

            $scope.uiCloseDate = function (datepicker) {
                if (datepicker === 'start_date') {
                    $scope.startDateOpen = false;
                } else if (datepicker === 'end_date') {
                    $scope.endDateOpen = false;
                }

                return false;
            };

            $scope.$watchCollection('filter', function (filters, previous) {
                var showControls = false,
                    defaults = GlobalFilter.getDefaults();

                angular.forEach(defaults, function (value, key) {
                    if ($scope.filter[key] && defaults[key] != $scope.filter[key]) {
                        showControls = true;
                    }
                });

                $scope.showFilterControls = showControls;
            });
        }
    };
}];
