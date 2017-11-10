module.exports = [
    '$scope',
    '$translate',
    '$transition$',
    '_',
    'PostFilters',
    'savedSearch',
    'UserEndpoint',
    'Notify',
    '$state',
    function (
        $scope,
        $translate,
        $transition$,
        _,
        PostFilters,
        savedSearch,
        UserEndpoint,
        Notify,
        $state
    ) {
        var viewLayouts = {'data': 'd', 'list': 'a', 'map': 'a'};
        // Set view based on route or set view
        $scope.currentView = function () {
            return $transition$.params().view || savedSearch.view;
        };
        $scope.isLoading = {state: true};
        $scope.layout = viewLayouts[$scope.currentView()];
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

        // Set initial filter state
        PostFilters.setMode('savedsearch', savedSearch.id);

        var filters = savedSearch.filter;
        PostFilters.setFilters(filters);
        $scope.filters = PostFilters.getFilters();
        /**
         * @uirouter-refactor improve on this as we continue migrations?
         * call getPosts or loadPosts manually to ensure the collection reloads
         * In the map we are using the previous sibling, this comes from the fact that we have a named ui-view setup in
         * the list.map state to render the map collections.
         * Calling prevsibling makes me a bit uncomfortable compared to parent, altought objectively is not all that different
         * in terms of how fragile it is.
         * We can probably figure out a better way to do this.
         * @FIXME ?
         */
        if ($transition$.params().view === 'map') {
            $scope.$$prevSibling.loadPosts(null, null, null, true);
        } else {
            $scope.$parent.getPosts(false, false, true);
        }
        // Slight hack: to avoid incorrectly detecting a changed search
        // we push the real query we're using back into the saved search.
        // This will now include any default params we excluded before
        savedSearch.filter = angular.copy(PostFilters.getFilters());
    }
];
