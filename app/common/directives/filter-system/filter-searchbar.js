/**
 * Ushahidi Angular Filter System Master directive
 * Drop in directive master directive responsible for search
 * and selection of appropriate sub directive
 */

module.exports = ['$timeout', 'PostFilters',
function ($timeout, PostFilters) {
    var link =
        function (
            $scope, $elem, $attrs, formControl
        ) {
            $scope.searchResultsVisible = false;
            $scope.form = formControl;

            $scope.showSearchResults = function () {
                $scope.searchResultsVisible = true;
            };

            $scope.hideSearchResults = function () {
                $timeout(function () {
                    $scope.searchResultsVisible = false;
                }, 100);
            };

            $scope.enableQuery = function () {
                PostFilters.qEnabled = true;
                PostFilters.reactiveFilters = 'enabled';
            };

            $scope.removeFilter = function (filterKey, value) {
                $scope.filters.q = '';
                PostFilters.clearFilter(filterKey, value);
            };
        };
    return {
        restrict: 'E',
        replace: true,
        template: require('./filter-searchbar.html'),
        scope: {
            filters: '=',
            model: '=',
            placeholderEntity: '='
        },
        link: link,
        require: '?^form'
    };
}];
