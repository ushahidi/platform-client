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

SavedSearchModalController.$inject = ['$scope', '$element', '$attrs', '$rootScope', 'UserEndpoint', 'SavedSearchEndpoint', '_', 'ModalService'];
function SavedSearchModalController($scope, $element, $attrs, $rootScope, UserEndpoint, SavedSearchEndpoint, _, ModalService) {
    var users = [];

    $scope.searchSearches = searchSearches;
    $scope.createNewSearch = createNewSearch;
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
            $scope.searches = searches;

            angular.forEach($scope.searches, function (search) {
                // if this search has a user, and its not the currentUser
                if (_.isObject(search.user) && search.user.id !== _.result($rootScope.currentUser, 'userId')) {
                    // Load the user (if we haven't already)
                    if (!users[search.user.id]) {
                        users[search.user.id] = UserEndpoint.getFresh({id: search.user.id});
                    }
                    // Save user info onto the search itself
                    search.user = users[search.user.id];
                }
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
}
