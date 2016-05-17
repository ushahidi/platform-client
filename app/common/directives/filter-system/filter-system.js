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
            $scope.searchResultsActive = false;

            $scope.setSearchResultsActive = function () {
                $scope.searchResultsActive = true;
            };

            $scope.search = function (query) {
                $scope.searchResultsActive = false;
                $scope.filters.q = query;
                $scope.queryFnc();
            };

        }];
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'templates/common/filter-system/filter-system.html',
        scope: {
            entityType: '=',
            filters: '=',
            queryFnc: '&'
        },
        controller: controller
    };
}];
