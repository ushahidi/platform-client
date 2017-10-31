module.exports = [
    '$q',
    '$rootScope',
    'SavedSearchEndpoint',
    '_',
    'Notify',
    'PostFilters',
function (
    $q,
    $rootScope,
    SavedSearchEndpoint,
    _,
    Notify,
    PostFilters
) {
    return {
        restrict: 'E',
        template: require('./savedsearch-update.html'),
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

            $scope.saveSearch = function () {
                // Copy the current filters into our search..
                $scope.savedSearch.filter = PostFilters.getQueryParams($scope.filters);
                $scope.isSaving = true;
                SavedSearchEndpoint.update($scope.savedSearch)
                .$promise
                .then(function (savedSearch) {
                    $scope.isSaving = false;
                    Notify.notify('notify.savedsearch.savedsearch_updated', {savedsearch: savedSearch.name});
                    $scope.resetSearch();
                }, function (errorResponse) {
                    $scope.isSaving = false;
                    Notify.apiErrors(errorResponse);
                });
            };

            $scope.resetSearch = function () {
                PostFilters.setFilters($scope.savedSearch.filter);
                // Slight hack: to avoid incorrectly detecting a changed search
                // we push the real query we're using back into the saved search.
                // This will now include any default params we excluded before
                $scope.savedSearch.filter = angular.copy(PostFilters.getFilters());
            };
        }
    };
}];
