module.exports = SavedSearchListing;

SavedSearchListing.$inject = [];
function SavedSearchListing() {
    return {
        restrict: 'E',
        scope: true,
        controller: SavedSearchListingController,
        templateUrl: 'templates/posts/views/saved-search-dropdown.html'
    };
}

SavedSearchListingController.$inject = ['$scope', '$element', '$attrs', '$rootScope', 'UserEndpoint', 'SavedSearchEndpoint', '_'];
function SavedSearchListingController($scope, $element, $attrs, $rootScope, UserEndpoint, SavedSearchEndpoint, _) {
    var users = [];

    $scope.searchSearches = searchSearches;

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
                        users[search.user.id] = UserEndpoint.get({id: search.user.id});
                    }
                    // Save user info onto the search itself
                    search.user = users[search.user.id];
                }
            });
        });
    }

    function searchSearches(query) {
        loadSavedSearches({
            q : query
        });
    }
}
