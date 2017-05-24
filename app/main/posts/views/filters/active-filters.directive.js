module.exports = ActiveFilters;

ActiveFilters.$inject = ['$translate', '$filter', 'PostFilters', '_', 'TagEndpoint', 'RoleEndpoint', 'UserEndpoint'];
function ActiveFilters($translate, $filter, PostFilters, _, TagEndpoint, RoleEndpoint, UserEndpoint) {
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
            // Remove form filter as its shown by the mode-context-form-filter already
            delete activeFilters.form;
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
            }
        };
    }
}
