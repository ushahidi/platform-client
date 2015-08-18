module.exports = [
    '$translate',
    '$filter',
    'GlobalFilter',
    '_',
function (
    $translate,
    $filter,
    GlobalFilter,
    _
) {

    return {

        restrict: 'E',
        replace: true,
        scope: true,
        templateUrl: 'templates/posts/active-filters.html',
        link: function ($scope) {

            $scope.activeFilters = {};

            var options = GlobalFilter.options;
            var defaults = GlobalFilter.getDefaults();

            var makeArray = function (value) {
                if (!angular.isArray(value)) {
                    return [value];
                }
                return value;
            };

            $scope.$watch(function () {
                return JSON.stringify(GlobalFilter.getPostQuery());
            }, function (filters) {
                var activeFilters = angular.copy(GlobalFilter.getPostQuery());

                if (activeFilters.status === 'all') {
                    delete activeFilters.status;
                }

                delete activeFilters.within_km;

                $scope.activeFilters = _.mapObject(activeFilters, makeArray);
            });

            var transformers = {
                tags : function (value) {
                    return options.tags[value] ? options.tags[value].tag : value;
                },
                form : function (value) {
                    return options.forms[value] ? options.forms[value].name : value;
                },
                current_stage : function (value) {
                    var stages = _.flatten(_.values(options.postStages), true),
                        stage = _.findWhere(stages, {id : value});
                    return stage ? stage.label : value;
                },
                set : function (value) {
                    return options.collections[value] ? options.collections[value].name : value;
                },
                center_point : function (value) {
                    return $translate.instant('global_filter.filter_tabs.location_value', {
                        value: GlobalFilter.location_text ? GlobalFilter.location_text : value,
                        km: GlobalFilter.within_km
                    });
                },
                created_before : function (value) {
                    return $filter('date', 'longdate')(value);
                },
                created_after : function (value) {
                    return $filter('date', 'longdate')(value);
                }
            };

            $scope.transformFilterValue = function (value, key) {
                if (transformers[key]) {
                    return transformers[key](value);
                }

                return value;
            };

            $scope.removeFilter = function (filterKey, value) {
                if (angular.isArray(GlobalFilter[filterKey])) {
                    GlobalFilter[filterKey] = _.without(GlobalFilter[filterKey], value);
                } else {
                    // Todo ensure cloning
                    GlobalFilter[filterKey] = defaults[filterKey];
                }
            };
        }
    };

}];
