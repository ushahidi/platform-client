module.exports = [
    '$q',
    '$rootScope',
    'SavedSearchEndpoint',
    '_',
    'Notify',
function (
    $q,
    $rootScope,
    SavedSearchEndpoint,
    _,
    Notify
) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'templates/sets/savedsearch-update.html',
        scope: {
            savedSearch: '=',
            filters: '='
        },
        link: function ($scope, $element, $attrs) {
            if (!$scope.savedSearch) {
                throw {
                    message: 'savedsearchEditor must be passed a saved-search parameter'
                };
            }

            // Compare current filters to saved filters
            $scope.filtersChanged = function () {
                return !angular.equals($scope.filters, $scope.savedSearch.filter);
            };

            $scope.saveSavedSearchFilters = function () {
                // Copy the current filters into our search..
                $scope.savedSearch.filter = $scope.filters;

                // Strip out any null values from visible_to
                $scope.savedSearch.visible_to = _.without(_.values($scope.savedSearch.visible_to), null);

                SavedSearchEndpoint.update($scope.savedSearch)
                .$promise
                .then(function (savedSearch) {
                    $rootScope.$broadcast('event:savedSearch:update');
                }, function (errorResponse) {
                    Notify.showApiErrors(errorResponse);
                });
            };
        }
    };
}];
