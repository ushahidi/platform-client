module.exports = [
    'Geocoding',
    'GlobalFilter',
    '_',
function(
    Geocoding,
    GlobalFilter,
    _
) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            post: '=',
            active: '@',
            translate: '@'
        },
        templateUrl: 'templates/partials/post-view-tabs.html',
        link: function($scope, $element, $attrs) {
            $scope.filter = {};
            $scope.global_filter = GlobalFilter;

            var available_filters = [
                'keyword', 'start_date', 'end_date', 'location', 'within_km',
            ];

            var filter_translations = {
                location: function() {
                    var location = $scope.filter.location;
                    var valid_coords = /\-?[0-9]+(\.[0-9]+)?\s*,\s*\-?[0-9]+(\.[0-9]+)?/;

                    if (valid_coords.test(location)) {
                        // if the location is already a lat/lon, pass it through
                        GlobalFilter.location = location;
                    } else { // perform a geocoding lookup on the location
                        Geocoding.search(location).then(function(coordinates) {
                            if (!coordinates) { return; } // @todo - handle bad lookup
                            GlobalFilter.location = coordinates[0] + ',' + coordinates[1];
                        });
                    }
                }
            };

            // initialize local filters
            _.each(available_filters, function(key) {
                if (GlobalFilter[key]) {
                    $scope.filter[key] = GlobalFilter[key];
                }
            });

            $scope.applyFilter = function() {
                _.each(available_filters, function(key) {
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

            $scope.clearFilter = function() {
                $scope.filter = _.omit($scope.filter, available_filters);
                $scope.applyFilter();
            };

            $scope.showAllTagsHandler = function() {
                if (this.show_all_tags) {
                    GlobalFilter.clearSelectedTags();
                }
            };

            $scope.showAllPostTypesHandler = function() {
                if (this.show_all_post_types) {
                    GlobalFilter.clearSelectedPostTypes();
                }
            };
        },
    };
}];
