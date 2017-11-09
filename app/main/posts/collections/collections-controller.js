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
             * call getPosts manually to ensure the collection reloads
             */
            $scope.$parent.getPosts(false, false, true);
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
