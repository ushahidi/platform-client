module.exports = [
    '$scope',
    '$translate',
    '$routeParams',
    'GlobalFilter',
    'collection',
    'UserEndpoint',
    function (
        $scope,
        $translate,
        $routeParams,
        GlobalFilter,
        collection,
        UserEndpoint
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
        $scope.getCollectionUser = function () {
            return $scope.collection.user_id ? UserEndpoint.get({id: $scope.collection.user_id}) : undefined;
        };
        $scope.collection.user = $scope.getCollectionUser();
        // Set the page title
        $translate('post.posts').then(function (title) {
            $scope.title = title;
            $scope.$emit('setPageTitle', title);
        });
    }
];
