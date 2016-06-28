module.exports = [
    '$rootScope',
    'ModalService',
    'PostFilters',
function (
    $rootScope,
    ModalService,
    PostFilters
) {
    return {
        restrict: 'E',
        templateUrl: 'templates/sets/savedsearches/savedsearch-create.html',
        link: function ($scope, $element, $attrs) {

            // Init an empty saved search
            $scope.savedSearch = {
                view : 'map',
                visibile_to : []
            };

            // Compare current filters to default filters
            $scope.hasFilters = function () {
                return PostFilters.hasFilters($scope.filters);
            };

            $scope.saveSearch = function () {
                // Copy the current filters into our search..
                $scope.savedSearch.filter = $scope.filters;

                ModalService.openTemplate('<saved-search-editor saved-search="savedSearch"></saved-search-editor>', 'set.create_savedsearch', 'star', $scope, false, false);
            };

            $scope.clearFilters = function () {
                PostFilters.clearFilters();
            };
        }
    };
}];
