module.exports = SavedSearchModal;

SavedSearchModal.$inject = [];
function SavedSearchModal() {
    return {
        restrict: 'E',
        scope: true,
        controller: SavedSearchModalController,
        template: require('./saved-search-modal.html')
    };
}

SavedSearchModalController.$inject = ['$scope', '$element', '$attrs', '$rootScope', '$location', 'UserEndpoint', 'SavedSearchEndpoint', '_', 'ModalService'];
function SavedSearchModalController($scope, $element, $attrs, $rootScope, $location, UserEndpoint, SavedSearchEndpoint, _, ModalService) {
    $scope.searchSearches = searchSearches;
    $scope.createNewSearch = createNewSearch;
    $scope.goToSearch = goToSearch;
    activate();

    // Reload searches on login / logout events
    $scope.$on('event:authentication:logout:succeeded', loadSavedSearches);
    $scope.$on('event:authentication:login:succeeded', loadSavedSearches);
    $scope.$on('savedSearch:update', loadSavedSearches);

    function activate() {
        loadSavedSearches();
    }

    // Load searches + users
    function loadSavedSearches(query) {
        $scope.searches = [];
        query = query || {};
        SavedSearchEndpoint.query(query).$promise.then(function (searches) {
            $scope.searches = _.filter(searches, function (search) {
                var isOwner = (search.user && search.user.id === _.result($rootScope.currentUser, 'userId')) === true;
                return search.featured || isOwner;
            });
        });
    }

    function createNewSearch() {
        // Copy the current filters into our search..
        ModalService.openTemplate('<saved-search-editor saved-search="savedSearch"></saved-search-editor>', 'set.create_savedsearch', 'star', $scope, false, false);
    }
    function searchSearches(query) {
        loadSavedSearches({
            q : query
        });
    }

    /**
     * @param searchId: the saved search id, used to identify it in the url path.
     * We are just closing the modal before we go to the new saved search the user selected in the frontend.
     * See: https://waffle.io/ushahidi/platform/cards/598289fa17b93500a65be936
     */
    function goToSearch(searchId) {
        ModalService.close();
        $location.url('/savedsearches/' + searchId);
    }

}
