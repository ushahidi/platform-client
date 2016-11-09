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
        // Set view based on route or set view
        $scope.currentView = function () {
            return $routeParams.view || collection.view;
        };

        $scope.$emit('event:collection:show', collection);
        $scope.$on('$destroy', function () {
            $scope.$emit('event:collection:close');
        });

        // Add set to the scope
        $scope.collection = collection;
        $scope.collection.user = getCollectionUser();
        function getCollectionUser() {
            return $scope.collection.user ? UserEndpoint.get({id: $scope.collection.user.id}) : undefined;
        }

        // Set the page title
        $translate('post.posts').then(function (title) {
            $scope.title = title;
            $scope.$emit('setPageTitle', title);
        });

        // Extend filters, always adding the current collection id
        var extendFilters = function (filters) {
            //filters = angular.copy(filters, { set : []});
            filters.set = [];
            filters.set.push(collection.id);

            return filters;
        };

        // whenever the GlobalFilter post query changes,
        // update the current list of posts
        $scope.$watch(function () {
            return PostFilters.getFilters();
        }, function (newValue, oldValue) {
            $scope.filters = extendFilters(newValue);
        }, true);

        // Reset GlobalFilter + add set filter
        // Ensure that ALL posts are visible under collections
        // Set default collection status filters
        PostFilters.clearFilters();
        PostFilters.setFilters({ status: ['archived', 'draft', 'published'] });
        $scope.filters = extendFilters(PostFilters.getFilters());

    }
];
