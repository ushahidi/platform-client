module.exports = [
    '$scope',
    '$translate',
    '$routeParams',
    '_',
    'PostFilters',
    'savedSearch',
    'UserEndpoint',
    'Notify',
    function (
        $scope,
        $translate,
        $routeParams,
        _,
        PostFilters,
        savedSearch,
        UserEndpoint,
        Notify
    ) {
        // Set view based on route or set view
        $scope.currentView = function () {
            return $routeParams.view || savedSearch.view;
        };

        $scope.$emit('event:savedsearch:show', savedSearch);
        $scope.$on('$destroy', function () {
            $scope.$emit('event:savedsearch:close');
        });

        // Add set to the scope
        $scope.savedSearch = savedSearch;
        $scope.getSavedSearchUser = function () {
            return $scope.savedSearch.user ? UserEndpoint.get({id: $scope.savedSearch.user.id}) : undefined;
        };
        $scope.savedSearch.user = $scope.getSavedSearchUser();

        $translate('post.posts').then(function (title) {
            $scope.title = title;
            $scope.$emit('setPageTitle', title);
        });

        // whenever the GlobalFilter post query changes,
        // update the current list of posts
        $scope.$watch(function () {
            return PostFilters.getFilters();
        }, function (newValue, oldValue) {
            $scope.filters = PostFilters.getFilters();
        }, true);

        // Set initial filter state
        PostFilters.setFilters(savedSearch.filter);
        // Slight hack: to avoid incorrectly detecting a changed search
        // we push the real query we're using back into the saved search.
        // This will now include any default params we excluded before
        savedSearch.filter = PostFilters.getFilters();
    }
];
