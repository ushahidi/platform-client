module.exports = PostViewMap;

PostViewMap.$inject = ['PostEndpoint', 'Maps', '_', 'PostFilters', 'Leaflet', '$q', '$rootScope', '$compile', '$location', '$timeout'];
function PostViewMap(PostEndpoint, Maps, _, PostFilters, L, $q, $rootScope, $compile, $location, $timeout) {
    return {
        restrict: 'E',
        replace: true,
        scope: {},
        template: require('./post-view-map.html'),
        link: {
            pre: function ($scope, element, attrs) {
                $scope.getUIClass = 'full-size';
            },
            post: PostViewMapLink
        },
        controller: require('./post-view-map.controller.js')
    };

    function PostViewMapLink($scope, element, attrs, controller) {
        var createMapDirective =  Maps.createMap(element[0].querySelector('#map'));
        var createMap = createMapDirective.then(function (data) {
            $scope.map = data;
        });
        // When data is loaded
        $q.all({
            map: createMap,
            posts: $scope.posts
        })
        .then(function (data) {
            $scope.addPostsToMap(data.posts);
            return data;
        })
        .then($scope.watchFilters)
        ;

        // Cleanup leaflet map
        $scope.$on('$destroy', function () {
            if ($scope.map) {
                $scope.map.remove();
            }
        });


    }
}
