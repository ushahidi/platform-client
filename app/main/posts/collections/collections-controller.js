module.exports = [
    '$scope',
    '$translate',
    '$routeParams',
    'PostFilters',
    'collection',
    'UserEndpoint',
    '_',
    function (
        $scope,
        $translate,
        $routeParams,
        PostFilters,
        collection,
        UserEndpoint,
        _
    ) {
        // Add set to the scope
        $scope.collection = collection;
        $scope.currentView = currentView;

        activate();

        function activate() {
            setCollection(collection);

            // Set the page title
            $translate('post.posts').then(function (title) {
                $scope.title = title;
                $scope.$emit('setPageTitle', title);
            });

            $scope.$emit('event:collection:show', collection);
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
            PostFilters.setMode('collection', collection.id);
            $scope.filters = PostFilters.getFilters();
        }

        // Set view based on route or set view
        function currentView() {
            return $routeParams.view || collection.view;
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
