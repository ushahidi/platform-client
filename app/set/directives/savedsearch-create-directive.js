module.exports = [
function (
) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'templates/sets/savedsearch-create.html',
        scope: {
            filters: '='
        },
        link: function ($scope, $element, $attrs) {

            // Init an empty saved search
            $scope.savedSearch = {
                view : 'map',
                visibile_to : []
            };

            // Compare current filters to default filters
            $scope.filtersChanged = function () {
                return !angular.equals($scope.filters, { status : 'all' });
            };

            $scope.savedSearchOpen = {};
            $scope.savedSearchOpen.data = false;
            $scope.setSavedSearchOpen = function () {
                // Copy the current filters into our search..
                $scope.savedSearch.filter = $scope.filters;
                // .. and trigger the modal open
                $scope.savedSearchOpen.data = !$scope.savedSearchOpen.data;
            };
        }
    };
}];
