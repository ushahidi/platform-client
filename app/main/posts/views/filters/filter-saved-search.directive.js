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
        console.log(ngModel);
        (function loadSavedSearches() {
            SavedSearchEndpoint.query({}).$promise.then(function (searches) {
                $scope.searches = _.filter(searches, function (search) {
                    var isOwner = (search.user && search.user.id === _.result($rootScope.currentUser, 'userId')) === true;
                    return search.featured || isOwner;
                });
            });
        })();
        $scope.selectedSearch = '0';
        $scope.$watch('selectedSearch', saveToView, true);
        function saveToView(selectedSearch) {
            ngModel.$setViewValue(selectedSearch);

        }
    }
}
