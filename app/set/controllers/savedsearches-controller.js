module.exports = [
    '$scope',
    '$translate',
    '$routeParams',
    '_',
    'GlobalFilter',
    'savedsearch',
    function (
        $scope,
        $translate,
        $routeParams,
        _,
        GlobalFilter,
        savedsearch
    ) {
        // Set view based on route or set view
        $scope.currentView = $routeParams.view || savedsearch.view;

        // Add set to the scope
        $scope.savedsearch = savedsearch;

        // Set the page title
        $translate('post.posts').then(function (title) {
            $scope.title = title;
            $scope.$emit('setPageTitle', title);
        });

        // Check if we can edit
        $scope.canEdit = function () {
            return _.contains(savedsearch.allowed_privileges, 'update');
        };

        // whenever the GlobalFilter post query changes,
        // update the current list of posts
        $scope.$watch(function () {
            return JSON.stringify(GlobalFilter.getPostQuery());
        }, function (newValue, oldValue) {
            $scope.filters = GlobalFilter.getPostQuery();
        });

        // Set initial filter state
        $scope.filters = savedsearch.filter;
        GlobalFilter.setSelected(savedsearch.filter);
    }
];
