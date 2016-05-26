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
        function (
            $scope
        ) {
            // Used for displaying search result preview
            // Not currently used but working
            /*
            $scope.showQueryResults = false;

            $scope.setSearchResultsActive = function () {
                $scope.showQueryResults = true;
            };
            */
        }];
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'templates/common/filter-system/filter-searchbar.html',
        scope: {
            model: '=',
            placeholderEntity: '='
        },
        controller: controller
    };
}];
