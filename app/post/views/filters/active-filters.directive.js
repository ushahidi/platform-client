module.exports = ActiveFilters;

ActiveFilters.$inject = ['$translate', '$filter', 'PostFilters', '_', 'TagEndpoint', 'RoleEndpoint', 'UserEndpoint'];
function ActiveFilters($translate, $filter, PostFilters, _, TagEndpoint, RoleEndpoint, UserEndpoint) {
    return {
        restrict: 'E',
        scope: true,
        templateUrl: 'templates/posts/views/filters/active-filters.html',
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
                return PostFilters.getQueryParams(PostFilters.getFilters());
            }, handleFiltersUpdate, true);

            TagEndpoint.query().$promise.then(function (results) {
                tags = _.indexBy(results, 'id');
            });
            RoleEndpoint.query().$promise.then(function (results) {
                roles = _.indexBy(results, 'name');
            });
            UserEndpoint.query().$promise.then(function (results) {
                users = _.indexBy(results.results, 'id');
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

            // Transform status + published_to into visible to value
            // @todo move to service
            if (activeFilters.status) {
                if (activeFilters.status === 'draft') {
                    activeFilters.visible_to = 'draft';
                } else if (activeFilters.status === 'published' && activeFilters.published_to) {
                    activeFilters.visible_to = activeFilters.published_to;
                }
                // Otherwise visible_to = 'everyone' which is default
                delete activeFilters.status;
            }
            if (activeFilters.published_to) {
                delete activeFilters.published_to;
            }

            // Remove form filter as its shown by the mode-context-form-filter already
            delete activeFilters.form;

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
            visible_to : function (value) {
                if (value === 'everyone') {
                    return $translate.instant('nav.everyone');
                } else if (value === 'draft') {
                    return $translate.instant('nav.only_you');
                } else {
                    return roles[value] ? roles[value].display_name : value;
                }
            }
        };
    }
}


