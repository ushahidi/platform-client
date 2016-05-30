module.exports = [
function (
) {
    var controller = [
        '$scope',
        'PostEndpoint',
        'Maps',
        '_',
        'PostFilters',
    function (
        $scope,
        PostEndpoint,
        Maps,
        _,
        PostFilters
    ) {
        // Set initial map params
        angular.extend($scope, Maps.getInitialScope());
        // Load map params, including config from server (async)
        Maps.getAngularScopeParams().then(function (params) {
            angular.extend($scope, params);
        });

        // load geojson posts into the map obeying the global filter settings
        var map = Maps.getMap('map');
        var reloadMapPosts = function (query) {
            query = query || PostFilters.getQueryParams($scope.filters);

            $scope.isLoading = true;
            return PostEndpoint.geojson(query).$promise.then(function (posts) {
                map.reloadPosts(posts);
                $scope.isLoading = false;
            });
        };

        // whenever filters change, reload the posts on the map
        $scope.$watch(function () {
            return $scope.filters;
        }, function (newValue, oldValue) {
            if (newValue !== oldValue) {
                reloadMapPosts();
            }
        }, true);

        // Initial load
        reloadMapPosts();
    }];

    return {
        restrict: 'E',
        replace: true,
        scope: {
            filters: '=',
            isLoading: '='
        },
        controller: controller,
        templateUrl: 'templates/views/map.html'
    };
}];
