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
        var currentGeoJsonRequests = [];
        var limit = 200;
        var requestBlockSize = 5;
        var numberOfChunks = 0;

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

        function clearData() {
            if (markers) {
                map.removeLayer(markers);
                markers = undefined;
            }
        }

        function addPostsToMap(posts) {

            var geojson = L.geoJson(posts, {
                pointToLayer: Maps.pointToLayer,
                onEachFeature: onEachFeature
            });

            if (map.options.clustering) {

                markers = markers ? markers : L.markerClusterGroup();
                // This has to be done individually.
                // Using clusterLayer.addLayers() breaks the clustering.
                // Need to investigate as this should have been fixing in v1.0.0
                angular.forEach(geojson.getLayers(), function (layer) {
                    markers.addLayer(layer);
                });
            } else {
                markers = geojson;
            }
            markers.addTo(map);

            if (posts.features.length > 0) {
                map.fitBounds(geojson.getBounds());
            }
            // Focus map on data points but..
            // Avoid zooming further than 15 (particularly when we just have a single point)
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
                    cancelCurrentRequests();
                    clearData();
                    reloadMapPosts();
                }
            }, true);
        }

        function cancelCurrentRequests() {
            _.each(currentGeoJsonRequests, function (request) {
                request.$cancelRequest();
            });
            currentGeoJsonRequests = [];
        }

        function reloadMapPosts() {
            var test = loadPosts();
            test.then(addPostsToMap);
        }

        function loadPosts(query, offset, currentBlock) {
            offset = offset || 0;
            currentBlock = currentBlock || 1;

            query = query || PostFilters.getQueryParams($scope.filters);

            var conditions = _.extend(query, {
                limit: limit,
                offset: offset,
                has_location: 'mapped'
            });
            $scope.isLoading.state = true;

            var request = PostEndpoint.geojson(conditions);
            currentGeoJsonRequests.push(request);

            return request.$promise.then(function (posts) {

                // Set number of chunks
                if (offset === 0 && posts.total > limit) {
                    numberOfChunks = Math.floor((posts.total - limit) / limit);
                    numberOfChunks += ((posts.total - limit) % limit) > 0 ? 1 : 0;
                }

                // Retrieve blocks of chunks
                // At the end of a block request the next block of chunks
                if (numberOfChunks > 0 && currentBlock === 1) {
                    var block = numberOfChunks > requestBlockSize ? requestBlockSize : numberOfChunks;
                    numberOfChunks -= requestBlockSize;
                    while (block > 0) {
                        block -= 1;
                        offset += limit;
                        loadPosts(query, offset, block).then(addPostsToMap);
                    }
                }

                if (numberOfChunks <= 0) {
                    $scope.isLoading.state = false;
                }
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
