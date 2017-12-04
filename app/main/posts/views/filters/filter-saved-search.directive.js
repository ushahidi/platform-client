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

        activate();

        function activate() {
            loadSavedSearches().then(function () {
                if (ngModel.$viewValue) {
                    scope.selectedSavedSearch = scope.searches[ngModel.$viewValue.id];
                } else if (PostFilters.getModeId()) {
                    scope.selectedSavedSearch = scope.searches[PostFilters.getModeId()];
                }

                scope.$watch('selectedSavedSearch', saveValueToView, true);
            });

            scope.$on('savedSearch:update', loadSavedSearches);
            scope.$watch(PostFilters.getModeId, handleModeIdChange);
        }

        function saveValueToView(selectedSavedSearch) {
            var modeEntity = PostFilters.getModeEntity('savedsearch');
            var isSameSavedSearch = modeEntity ? selectedSavedSearch.id === modeEntity.id : false;
            if (selectedSavedSearch && selectedSavedSearch.hasOwnProperty('filter') && !isSameSavedSearch) {
                PostFilters.setFilters(selectedSavedSearch.filter);
                PostFilters.setMode('savedsearch', selectedSavedSearch);
            } else if (selectedSavedSearch === null && PostFilters.getModeId() !== null) {
                PostFilters.setMode('all');
            }
            ngModel.$setViewValue(selectedSavedSearch);
        }

        function handleModeIdChange(newValue, oldValue) {
            if (newValue !== oldValue) {
                if (typeof (newValue) === 'undefined' || newValue === null) {
                    scope.selectedSavedSearch = null;
                } else if (scope.searchesLength > 0) {
                    scope.selectedSavedSearch =  scope.searches[newValue];
                }
            }
        }

        // Load searches + users
        function loadSavedSearches() {
            scope.loading = true;
            return SavedSearchEndpoint.query({}).$promise.then(function (searches) {
                var searchesTmp = _.filter(searches, function (search) {
                    var isOwner = (search.user && search.user.id === _.result($rootScope.currentUser, 'userId')) === true;
                    return search.featured || isOwner;
                });
                scope.searches = _.indexBy(searchesTmp, 'id');
                scope.searchesLength = _.keys(scope.searches).length;
                scope.loading = false;
            });
        }
    }
}
