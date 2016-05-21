/**
 * Ushahidi Angular Filter System Master directive
 * Drop in directive master directive responsible for search
 * and selection of appropriate sub directive
 */

module.exports = [
function (
) {
    var controller = [
        '$scope',
        '$rootScope',
        '$translate',
        'Notify',
        'RoleEndpoint',
        '_',
        function (
            $scope,
            $rootScope,
            $translate,
            Notify,
            RoleEndpoint,
            _
        ) {
            $scope.showQueryResults = false;

            $scope.setSearchResultsActive = function () {
                $scope.showQueryResults = true;
            };

            $scope.search = function (query) {
                $scope.showQueryResults = false;
                $scope.searchResultsActive = false;
                $scope.filters.q = query;
            };

        }];
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'templates/common/filter-searchbar/filter-searchbar.html',
        scope: {
            filters: '='
        },
        controller: controller
    };
}];
