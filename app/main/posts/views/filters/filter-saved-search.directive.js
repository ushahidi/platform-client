module.exports = FilterSavedSearch;

FilterSavedSearch.$inject = ['SavedSearchEndpoint', '_', '$rootScope', 'ModalService', 'PostFilters'];
function FilterSavedSearch(SavedSearchEndpoint, _,  $rootScope, ModalService, PostFilters) {
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
        scope.searches = [];
        scope.searchesLength = 0;
        scope.loading = false;
        scope.$on('savedSearch:update', loadSavedSearches);
        scope.$watch(PostFilters.getModeId, function (newValue, oldValue) {
            if (typeof (newValue) === 'undefined') {
                scope.selectedSavedSearch = null;
            } else if (oldValue !== newValue && scope.searches.length > 0) {
                scope.selectedSavedSearch =  scope.searches[newValue];
            }
        });

        function activate() {
            if (ngModel.$viewValue) {
                scope.selectedSavedSearch = scope.searches[ngModel.$viewValue];
            } else if (PostFilters.getModeId()) {
                scope.selectedSavedSearch = scope.searches[PostFilters.getModeId()];
            }
            scope.$watch('selectedSavedSearch', saveValueToView, true);
        }
        function saveValueToView(selectedSavedSearch) {
            if (selectedSavedSearch && selectedSavedSearch.hasOwnProperty('filter')) {
                PostFilters.setFilters(selectedSavedSearch.filter);
                PostFilters.setMode('savedsearch', selectedSavedSearch.id);
            } else if (selectedSavedSearch === null && PostFilters.getModeId() !== null) {
                PostFilters.setMode('all');
            }
            ngModel.$setViewValue(selectedSavedSearch);
        }
        // Load searches + users
        function loadSavedSearches() {
            scope.loading = true;
            SavedSearchEndpoint.query({}).$promise.then(function (searches) {
                var searchesTmp = _.filter(searches, function (search) {
                    var isOwner = (search.user && search.user.id === _.result($rootScope.currentUser, 'userId')) === true;
                    return search.featured || isOwner;
                });
                scope.searches = _.indexBy(searchesTmp, 'id');
                scope.searchesLength = _.keys(scope.searches).length;
                scope.loading = false;
            }).then(function () {
                activate();
            }, function (err) {
                scope.loading = false;
            });
        }
        loadSavedSearches();
    }
}
