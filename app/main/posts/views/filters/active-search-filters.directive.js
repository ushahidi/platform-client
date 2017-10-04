module.exports = ActiveSearchFilters;

ActiveSearchFilters.$inject = ['$translate', '$filter', 'PostFilters', '_', 'TagEndpoint', 'RoleEndpoint', 'UserEndpoint', 'SavedSearchEndpoint', 'PostMetadataService', 'FormEndpoint'];
function ActiveSearchFilters($translate, $filter, PostFilters, _, TagEndpoint, RoleEndpoint, UserEndpoint, SavedSearchEndpoint, PostMetadataService, FormEndpoint) {
    return {
        restrict: 'E',
        scope: true,
        require: 'ngModel',
        template: require('./active-search-filters.html'),
        link: ActiveFiltersLink
    };

    function ActiveFiltersLink($scope, ngModel) {
        $scope.activeFilters = {};
        $scope.removeFilter = removeFilter;
        $scope.transformFilterValue = transformFilterValue;

        var rawFilters = {};
        var tags = [];
        var roles = [];
        var users = [];
        var forms = [];
        var savedSearches = [];

        activate();

        function activate() {
            $scope.$watch(function () {
                return PostFilters.getActiveFilters(PostFilters.getFilters());
            }, handleFiltersUpdate, true);

            RoleEndpoint.query().$promise.then(function (results) {
                roles = _.indexBy(results, 'name');
            });
            UserEndpoint.query().$promise.then(function (results) {
                users = _.indexBy(results.results, 'id');
            });
            TagEndpoint.query().$promise.then(function (results) {
                tags = _.indexBy(results, 'id');
            });
            FormEndpoint.query().$promise.then(function (results) {
                forms = _.indexBy(results, 'id');
            });
            SavedSearchEndpoint.query({}).$promise.then(function (searches) {
                savedSearches = _.indexBy(searches, 'id');
            });
        }

        function makeArray(value) {
            if (!angular.isArray(value)) {
                return [value];
            }
            return value;
        }

        function handleFiltersUpdate(filters) {
            var activeFilters = angular.copy(filters);
            rawFilters = angular.copy(filters);
            // Remove set filter as it is only relevant to collections and should be immutable in that view
            delete activeFilters.set;

            $scope.activeFilters = _.mapObject(activeFilters, makeArray);
        }

        function transformFilterValue(value, key) {
            if (transformers[key]) {
                return transformers[key](value);
            }

            return value;
        }

        function removeFilter(filterKey, value) {
            PostFilters.clearFilter(filterKey, value);
        }

        var transformers = {
            order_unlocked_on_top: function (value) {
                var boolText = value.value === false ? 'no' : 'yes';
                return $translate.instant('global_filter.filter_tabs.order_group.unlocked_on_top_' + boolText);
            },
            order_group_order: function (value) {
                return $translate.instant('global_filter.filter_tabs.order_group_order.' + value.order);
            },
            order_by: function (value) {
                return $translate.instant('global_filter.filter_tabs.order_group.order_by.' + value);
            },
            tags : function (value) {
                return tags[value] ? tags[value].tag : value;
            },
            user : function (value) {
                return users[value] ? users[value].realname : value;
            },
            saved_search: function (value) {
                return savedSearches[value] ? savedSearches[value].name : value;
            },
            center_point : function (value) {
                return $translate.instant('global_filter.filter_tabs.location_value', {
                    value: rawFilters.location_text ? rawFilters.location_text : value,
                    km: rawFilters.within_km
                });
            },
            created_before : function (value) {
                return $filter('date', 'longdate')(value);
            },
            created_after : function (value) {
                return $filter('date', 'longdate')(value);
            },
            date_before : function (value) {
                return $filter('date', 'longdate')(value);
            },
            date_after : function (value) {
                return $filter('date', 'longdate')(value);
            },
            status : function (value) {
                return $translate.instant('post.' + value);
            },
            source : function (value) {
                return PostMetadataService.formatSource(value);
            },
            form: function (value) {
                return forms[value] ? forms[value].name : value;
            }
        };
    }
}
