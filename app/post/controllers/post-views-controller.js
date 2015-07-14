module.exports = [
    '$scope',
    '$translate',
    '$routeParams',
    'GlobalFilter',
    function (
        $scope,
        $translate,
        $routeParams,
        GlobalFilter
    ) {
        // Set view based out route
        $scope.currentView = $routeParams.view;

        // Set the page title
        $translate('post.posts').then(function (title) {
            $scope.title = title;
            $scope.$emit('setPageTitle', title);
        });

        // whenever the GlobalFilter post query changes,
        // update the current list of posts
        $scope.$watch(function () {
            return JSON.stringify(GlobalFilter.getPostQuery());
        }, function (newValue, oldValue) {
            $scope.filters = GlobalFilter.getPostQuery();
        });

        // Reset filters
        GlobalFilter.clearSelected();
    }
];
