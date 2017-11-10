module.exports = [
    '$scope',
    '$translate',
    '$transition$',
    'PostFilters',
    'UserEndpoint',
    '_',
    function (
        $scope,
        $translate,
        $transition$,
        PostFilters,
        UserEndpoint,
        _
    ) {

        // Add set to the scope
        $scope.collection = $scope.$resolve.collection;
        $scope.currentView = currentView;
        var viewLayouts = {'data': 'd', 'list': 'a', 'map': 'a'};
        $scope.layout = viewLayouts[$scope.currentView()];

        activate();

        function activate() {
            setCollection($scope.collection);

            // Set the page title
            $translate('post.posts').then(function (title) {
                $scope.title = title;
                $scope.$emit('setPageTitle', title);
            });

            $scope.$emit('event:collection:show', $scope.collection);
            $scope.$on('$destroy', function () {
                $scope.$emit('event:collection:close');
            });

            // If collection is reloaded
            $scope.$on('collection:update', function (ev, collection) {
                // Check it was *this* collection
                if (collection.id === $scope.collection.id) {
                    setCollection(collection);
                }
            });

            // Reset GlobalFilter + add set filter
            // Ensure that ALL posts are visible under collections
            // Set default collection status filters
            PostFilters.setMode('collection', $scope.collection.id);
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
            // if ($transition$.params().view === 'map') {
            //     $scope.$$prevSibling.loadPosts(null, null, null, true);
            // } else {
            //     $scope.$parent.getPosts(false, false, true);
            // }

        }

        // Set view based on route or set view
        function currentView() {
            return $transition$.params().view || $scope.collection.view;
        }

        function setCollection(collection) {
            $scope.collection = collection;
            $scope.collection.user = getCollectionUser();
        }

        function getCollectionUser() {
            return $scope.collection.user ? UserEndpoint.get({id: $scope.collection.user.id}) : undefined;
        }

    }
];
