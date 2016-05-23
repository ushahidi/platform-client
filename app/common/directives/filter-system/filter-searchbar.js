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
        function (
            $scope,
            $rootScope,
            $translate
        ) {
            $scope.showQueryResults = false;

            $scope.setSearchResultsActive = function () {
                $scope.showQueryResults = true;
            };

        }];
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'templates/common/filter-system/filter-searchbar.html',
        scope: {
            filters: '=',
            placeholderEntity: '='
        },
        controller: controller
    };
}];
