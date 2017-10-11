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

    function FilterSavedSearchLink(scope, element, attrs, ngModel) {
        scope.selectedSavedSearch = null;
        function activate() {
            ngModel.$render = renderModelValue;
            if (ngModel.$viewValue.length > 0) {
                scope.selectedSavedSearch = scope.searches[ngModel.$viewValue];
            }
            scope.$watch('selectedSavedSearch', saveValueToView, true);
        }
        function saveValueToView(selectedSavedSearch) {
            ngModel.$setViewValue(selectedSavedSearch && selectedSavedSearch.id ?
                selectedSavedSearch.id.toString() : ngModel.$viewValue);
        }

        function renderModelValue() {
            scope.selectedSavedSearch = ngModel.$viewValue;
            // Update savedSearch w/o breaking references used by selectedSavedSearch model
        }

        // Load searches + users
        function loadSavedSearches() {
            SavedSearchEndpoint.query({}).$promise.then(function (searches) {
                var searchesTmp = _.filter(searches, function (search) {
                    var isOwner = (search.user && search.user.id === _.result($rootScope.currentUser, 'userId')) === true;
                    return search.featured || isOwner;
                });
                scope.searches = _.indexBy(searchesTmp, 'id');
            }).then(function () {
                activate();
            });
        }
        loadSavedSearches();
    }
}
