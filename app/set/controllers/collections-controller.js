module.exports = [
    '$scope',
    '$translate',
    '$routeParams',
    '_',
    'GlobalFilter',
    'collection',
    function (
        $scope,
        $translate,
        $routeParams,
        _,
        GlobalFilter,
        collection
    ) {
        // Set view based on route or set view
        $scope.currentView = $routeParams.view || collection.view;

        // Add set to the scope
        $scope.collection = collection;

        // Set the page title
        $translate('post.posts').then(function (title) {
            $scope.title = title;
            $scope.$emit('setPageTitle', title);
        });

        // Check if we can edit
        $scope.canEdit = function () {
            return _.contains(collection.allowed_privileges, 'update');
        };

        // Extend filters, always adding the current collection id
        var extendFilters = function (filters) {
            filters = _.extend({ set : [] }, filters);
            filters.set.push(collection.id);
            return filters;
        };

        // whenever the GlobalFilter post query changes,
        // update the current list of posts
        $scope.$watch(function () {
            return JSON.stringify(GlobalFilter.getPostQuery());
        }, function (newValue, oldValue) {
            $scope.filters = extendFilters(GlobalFilter.getPostQuery());
        });

        // Reset GlobalFilter + add set filter
        GlobalFilter.clearSelected();
        $scope.filters = extendFilters({});
    }
];
