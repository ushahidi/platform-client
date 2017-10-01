module.exports = FilterSavedSearch;

FilterSavedSearch.$inject = ['SavedSearchEndpoint', '_', '$rootScope'];
function FilterSavedSearch(SavedSearchEndpoint, _,  $rootScope) {
    return {
        restrict: 'E',
        require: 'ngModel',
        scope: {
        },
        link: FilterSavedSearchLink,
        template: require('./filter-saved-search.html')
    };

    function FilterSavedSearchLink($scope, $element, $attrs, ngModel) {
        // Load searches + users
        (function loadSavedSearches(query) {
            console.log($scope.searches);
            query = query || {};
            SavedSearchEndpoint.query(query).$promise.then(function (searches) {
                $scope.searches = _.filter(searches, function (search) {
                    var isOwner = (search.user && search.user.id === _.result($rootScope.currentUser, 'userId')) === true;
                    return search.featured || isOwner;
                });
            });
        })();
        $scope.data = {selectedSearch : ''};
        $scope.$watch('data', saveToView, true);
        function saveToView(selectedSearch) {
            ngModel.$setViewValue(angular.copy(selectedSearch));
        }
    }
}
