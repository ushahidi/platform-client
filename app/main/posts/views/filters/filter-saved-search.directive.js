module.exports = FilterSavedSearch;

FilterSavedSearch.$inject = [];
function FilterSavedSearch() {
    return {
        restrict: 'E',
        scope: {
        },
        controller: FilterSavedSearchController,
        link: function ($scope, $element, $attrs) {
            $scope.data = {selectedSearch: 0};
        },
        template: require('./filter-saved-search.html')
    };
}

FilterSavedSearchController.$inject = ['$scope', '$element', '$attrs', '$rootScope', '$location', 'UserEndpoint', 'SavedSearchEndpoint', '_', 'ModalService'];
function FilterSavedSearchController($scope, $element, $attrs, $rootScope, $location, UserEndpoint, SavedSearchEndpoint, _, ModalService) {
    // Load searches + users
    (function loadSavedSearches(query) {
        $scope.searches = [];
        query = query || {};
        SavedSearchEndpoint.query(query).$promise.then(function (searches) {
            $scope.searches = _.filter(searches, function (search) {
                var isOwner = (search.user && search.user.id === _.result($rootScope.currentUser, 'userId')) === true;
                return search.featured || isOwner;
            });
        });
    })();

}
