module.exports = PostViewMap;

PostViewMap.$inject = ['PostEndpoint', 'Maps', '_', 'PostFilters', 'Leaflet', '$q', '$rootScope', '$compile'];
function PostViewMap(PostEndpoint, Maps, _, PostFilters, L, $q, $rootScope, $compile) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            filters: '=',
            isLoading: '='
        },
        link: PostViewMapLink,
        template: require('./post-view-map.html')
    };

    function PostViewMapLink($scope, element, attrs) {
        var map, markers;

        activate();

        function activate() {
            // Start loading data
            var posts = loadPosts();
            var createMap = Maps.createMap(element[0].querySelector('#map'))
            .then(function (data) {
                map = data;
            });

            // When data is loaded
            $q.all({
                map: createMap,
                posts: posts
            })
            .then(function (data) {
                addPostsToMap(data.posts);
                return data;
            })
            .then(watchFilters)
            ;

            // Cleanup leaflet map
            $scope.$on('$destroy', function () {
                if (map) {
                    map.remove();
                }
            });
        }

        function addPostsToMap(posts) {
            if (markers) {
                map.removeLayer(markers);
            }

            var geojson = L.geoJson(posts, {
                pointToLayer: Maps.pointToLayer,
                onEachFeature: onEachFeature
            });

            markers = L.markerClusterGroup();
            // This has to be done individually.
            // Using clusterLayer.addLayers() breaks the clustering.
            // Need to investigate as this should have been fixing in v1.0.0
            angular.forEach(geojson.getLayers(), function (layer) {
                markers.addLayer(layer);
            });
            markers.addTo(map);
            // Focus map on data points but..
            // Avoid zooming further than 15 (particularly when we just have a single point)
            map.fitBounds(geojson.getBounds());
            if (map.getZoom() > 15) {
                map.setZoom(15);
            }
        }

        function watchFilters() {
            // whenever filters change, reload the posts on the map
            $scope.$watch(function () {
                return $scope.filters;
            }, function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    reloadMapPosts();
                }
            }, true);
        }

        function reloadMapPosts() {
            loadPosts().then(addPostsToMap);
        }

        function loadPosts(query) {
            query = query || PostFilters.getQueryParams($scope.filters);

            $scope.isLoading = true;
            return PostEndpoint.geojson(query).$promise.then(function (posts) {
                $scope.isLoading = false;
                return posts;
            });
        }

        function onEachFeature(feature, layer) {
            layer.on('click', function (e) {
                // Grab the layer that was actually clicked on
                var layer = e.layer;
                // If we somehow got the feature group: grab the first child
                // because the FeatureGroup doesn't get added to the map when clustering
                if (layer instanceof L.FeatureGroup) {
                    layer = layer.getLayers()[0];
                }

                if (layer.getPopup()) {
                    layer.openPopup();
                } else {
                    getPostDetails(feature).then(function (details) {
                        var scope = $rootScope.$new();
                        scope.post = details;

                        var el = $compile('<post-card post="post" short-content="true"></post-card>')(scope);

                        layer.bindPopup(el[0], {
                            'minWidth': '300',
                            'maxWidth': '300',
                            'className': 'pl-popup'
                        });
                        layer.openPopup();
                    });
                }
            });
        }

        function getPostDetails(feature) {
            return PostEndpoint.get({id: feature.properties.id}).$promise;
        }
    }
}
