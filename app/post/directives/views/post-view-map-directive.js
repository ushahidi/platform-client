module.exports = [
function (
) {
    var controller = [
        '$scope',
        'ConfigEndpoint',
        'PostEndpoint',
        'Maps',
        '_',
    function (
        $scope,
        ConfigEndpoint,
        PostEndpoint,
        Maps,
        _
    ) {
        // Set initial map params
        angular.extend($scope, Maps.getInitialScope());
        // Load map params, including config from server (async)
        Maps.getAngularScopeParams().then(function (params) {
            angular.extend($scope, params);
        });

        // load geojson posts into the map obeying the global filter settings
        var map = Maps.getMap('map');
        var reloadMapPosts = function (offset) {
            offset = offset || 0;
            var limit = 200,
            conditions = _.extend($scope.filters, {
                limit: limit,
                offset: offset
            });

            $scope.isLoading = true;
            PostEndpoint.geojson(conditions).$promise.then(function (posts) {
                // Add posts to map
                if (offset === 0) {
                    map.reloadPosts(posts);
                } else {
                    map.addMorePosts(posts);
                }
                $scope.isLoading = false;

                // Load next chunk
                if (posts.features.length > 0) {
                    reloadMapPosts(offset + limit);
                }
            });
        };

        // whenever filters change, reload the posts on the map
        $scope.$watch(function () {
            return $scope.filters;
        }, function (newValue, oldValue) {
            if (newValue !== oldValue) {
                reloadMapPosts();
            }
        });

        // initial load
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
