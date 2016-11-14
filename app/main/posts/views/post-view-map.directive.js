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
            var config = Maps.getMapConfig();
            var posts = loadPosts();

            // When data is loaded
            $q.all({
                config: config,
                posts: posts
            })
            // Create the map
            .then(createMap)
            ;

            // Cleanup leaflet map
            $scope.$on('$destroy', function () {
                if (map) {
                    map.remove();
                }
            });
        }

        function createMap(data) {
            var config = data.config;
            var posts = data.posts;

            map = L.map(element[0].querySelector('#map'), config);

            map.attributionControl.setPrefix(false);
            map.zoomControl.setPosition('bottomleft');
            map.setMaxBounds([[-90,-360],[90,360]]);
            map.on('popupopen', function (e) {
                var px = map.project(e.popup._latlng); // find the pixel location on the map where the popup anchor is
                px.y -= e.popup._container.clientHeight / 2; // find the height of the popup container, divide by 2, subtract from the Y axis of marker location
                map.panTo(map.unproject(px), {animate: true}); // pan to new center
            });

            // Add a layer control
            // L.control.layers(Maps.getBaseLayers(), {}).addTo(map);

            // Todo ideally these would be chained promises in activate()
            addPostsToMap(posts);
            watchFilters();
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
