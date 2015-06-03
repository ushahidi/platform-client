module.exports = [
    'Geocoding',
    'GlobalFilter',
    '_',
function (
    Geocoding,
    GlobalFilter,
    _
) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            halfWidth: '='
        },
        templateUrl: 'templates/partials/post-view-filters.html',
        link: function ($scope, $element, $attrs) {
            $scope.filter = {};
            $scope.global_filter = GlobalFilter;
            $scope.start_date_open = false;
            $scope.end_date_open = false;
            $scope.show_filter_controls = false;

            $scope.endpoint_busy = false;
            $scope.geocoding_busy = false;

            var available_filters = [
                'keyword', 'start_date', 'end_date', 'location', 'within_km'
            ];

            var filter_defaults = {
                tags: [],
                post_types: [],
                keyword: '',
                start_date: '',
                end_date: '',
                location: '',
                within_km: '1'
            };

            filter_translations = {
                location: function () {
                    var location = $scope.filter.location,
                        valid_coords = /\-?[0-9]+(\.[0-9]+)?\s*,\s*\-?[0-9]+(\.[0-9]+)?/;

                    if (valid_coords.test(location)) {
                        // if the location is already a lat/lon, pass it through
                        GlobalFilter.location = location;
                    } else { // perform a geocoding lookup on the location
                        $scope.geocoding_busy = true;

                        Geocoding.search(location).then(function (coordinates) {
                            if (!coordinates) {
                                return;
                            } // @todo - handle bad lookup
                            GlobalFilter.location = coordinates[0] + ',' + coordinates[1];
                            $scope.geocoding_busy = false;
                        });
                    }
                }
            };

            // initialize local filters
            _.each(available_filters, function (key) {
                if (GlobalFilter[key]) {
                    $scope.filter[key] = GlobalFilter[key];
                }
            });

            $scope.applyFilter = function () {
                _.each(available_filters, function (key) {
                    if ($scope.filter[key]) { // apply each filter with a value
                        if (filter_translations[key]) { // special cases
                            filter_translations[key]();
                        } else { // otherwise update the global filter
                            GlobalFilter[key] = $scope.filter[key];
                        }
                    } else { // filters with no value are removed
                        delete GlobalFilter[key];
                    }
                });
            };

            $scope.clearFilter = function () {
                $scope.filter = _.omit($scope.filter, available_filters);
                $scope.applyFilter();
            };

            $scope.showAllTagsHandler = function () {
                if (this.show_all_tags) {
                    GlobalFilter.clearSelectedTags();
                }
            };

            $scope.showAllPostTypesHandler = function () {
                if (this.show_all_post_types) {
                    GlobalFilter.clearSelectedPostTypes();
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
                    $scope.start_date_open = false;
                } else if (datepicker === 'end_date') {
                    $scope.end_date_open = false;
                }

                return false;
            };

            $scope.clearFilters = function () {
                angular.forEach(filter_defaults, function (value, key) {
                    if ($scope.filter[key]) {
                        if ($scope.filter[key] !== filter_defaults[key]) {
                            $scope.filter[key] = filter_defaults[key];
                        }
                    }
                });

                $scope.applyFilter();
            };

            $scope.$watchCollection('filter', function (filters, previous) {
                var show_controls = false;

                angular.forEach(filter_defaults, function (value, key) {
                    if ($scope.filter[key] && $scope.filter[key] !== value) {
                        show_controls = true;
                    }
                });

                $scope.show_filter_controls = show_controls;
            });

            $scope.$parent.$watch('posts_query', function (endpoint, previous) {
                $scope.endpoint_busy = (endpoint ? true : false);
            });
        }
    };
}];
