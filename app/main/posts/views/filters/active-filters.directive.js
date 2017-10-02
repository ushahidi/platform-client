module.exports = ActiveFilters;

ActiveFilters.$inject = ['$translate', '$filter', 'PostFilters', '_', 'TagEndpoint', 'RoleEndpoint', 'UserEndpoint', 'SavedSearchEndpoint', 'PostMetadataService'];
function ActiveFilters($translate, $filter, PostFilters, _, TagEndpoint, RoleEndpoint, UserEndpoint, SavedSearchEndpoint, PostMetadataService) {
    return {
        restrict: 'E',
        scope: true,
        template: require('./active-filters.html'),
        link: ActiveFiltersLink
    };

    function ActiveFiltersLink($scope) {
        $scope.activeFilters = {};
        $scope.removeFilter = removeFilter;
        $scope.transformFilterValue = transformFilterValue;

        var rawFilters = {};
        var tags = [];
        var roles = [];
        var users = [];
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
            console.log('activefilters', activeFilters);
            // Remove set filter as it is only relevant to collections and should be immutable in that view
            delete activeFilters.set;
            // Remove form filter as its shown by the mode-context-form-filter already,
            // exception: if user only wants to see incoming messages (activeFilters.form = ['none']), we keep the form-filter.
            if (!_.isEqual(activeFilters.form, ['none'])) {
                delete activeFilters.form;
            }
            // Remove categories since its shown by the mode-context-form-filter already
            if (filters.form && filters.form.length <= 1) {
                delete activeFilters.tags;
            }
            // Remove within_km as its shown with the center_point value
            delete activeFilters.within_km;
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
            order_group: function (value) {
                return $translate.instant('global_filter.filter_tabs.order_group.' + _.keys(value)[0]);
            },
            tags : function (value) {
                return tags[value] ? tags[value].tag : value;
            },
            user : function (value) {
                return users[value] ? users[value].realname : value;
            },
            // form : function (value) {
            //     return options.forms[value] ? options.forms[value].name : value;
            // },
            // current_stage : function (value) {
            //     var stages = _.flatten(_.values(options.postStages), true),
            //         stage = _.findWhere(stages, {id : value});
            //     return stage ? stage.label : value;
            // },
            // set : function (value) {
            //     return options.collections[value] ? options.collections[value].name : value;
            // },
            saved_search: function (value) {
                return savedSearches[value.selectedSearch] ? savedSearches[value.selectedSearch].name : value.selectedSearch;
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
                return PostMetadataService.formatSource(value);
            }
        };
    }
}
