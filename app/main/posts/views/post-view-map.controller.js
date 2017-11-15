module.exports = ['PostEndpoint', 'Maps', '_', 'PostFilters', 'Leaflet', '$q', '$rootScope', '$compile', '$location', '$timeout', '$scope','LoadingProgress',
    function PostViewMap(PostEndpoint, Maps, _, PostFilters, L, $q, $rootScope, $compile, $location, $timeout, $scope, LoadingProgress) {
        $scope.filters = PostFilters.getFilters();
        $scope.map;
        $scope.markers;
        $scope.limit = 200;
        $scope.requestBlockSize = 5;
        $scope.numberOfChunks = 0;
        $scope.currentGeoJsonRequests = [];
        $scope.loading = LoadingProgress.getLoadingState();
        LoadingProgress.subscribeOnLoadingState(function (loading) {
            $scope.loading = loading;
        });
        // Start loading data
        /**
         * functions
         */
        $scope.clearData = function () {
            if ($scope.markers) {
                $scope.map.removeLayer($scope.markers);
                $scope.markers = undefined;
            }
        };

        $scope.addPostsToMap = function (posts) {
            var geojson = L.geoJson(posts, {
                pointToLayer: Maps.pointToLayer,
                onEachFeature: $scope.onEachFeature
            });

            if ($scope.map.options.clustering) {

                $scope.markers = $scope.markers ? $scope.markers : L.markerClusterGroup();
                // This has to be done individually.
                // Using clusterLayer.addLayers() breaks the clustering.
                // Need to investigate as this should have been fixing in v1.0.0
                angular.forEach(geojson.getLayers(), function (layer) {
                    $scope.markers.addLayer(layer);
                });
            } else {
                $scope.markers = geojson;
            }
            $scope.markers.addTo($scope.map);

            if (posts.features.length > 0) {
                $scope.map.fitBounds(geojson.getBounds());
            }
            // Focus map on data points but..
            // Avoid zooming further than 15 (particularly when we just have a single point)
            if ($scope.map.getZoom() > 15) {
                $scope.map.setZoom(15);
            }
            $timeout(function () {
                $scope.map.invalidateSize();
            }, 1);
        };


        $scope.onEachFeature  = function (feature, layer) {
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
                    $scope.getPostDetails(feature).then(function (details) {
                        var scope = $rootScope.$new();
                        scope.post = details;
                        scope.goToPost = $scope.goToPost;
                        scope.selectedPost = {post : details};

                        var el = $compile('<post-card selected-post="selectedPost" post="post" short-content="true" click-action="goToPost"></post-card>')(scope);

                        layer.bindPopup(el[0], {
                            'minWidth': '300',
                            'maxWidth': '300',
                            'className': 'pl-popup'
                        });
                        layer.openPopup();
                    });
                }
            });
        };

        $scope.goToPost = function (post) {
            $location.path('/posts/' + post.id);
        };

        $scope.getPostDetails = function (feature) {
            return PostEndpoint.get({id: feature.properties.id}).$promise;
        };

        $scope.cancelCurrentRequests = function () {
            _.each($scope.currentGeoJsonRequests, function (request) {
                request.$cancelRequest();
            });
            $scope.currentGeoJsonRequests = [];
        };

        $scope.reloadMapPosts = function (query) {
            var test = $scope.loadPosts(query);
            test.then($scope.addPostsToMap);
        };

        $scope.watchFilters = function () {
            // whenever the qEnabled var changes, do a dummy update of $scope.filters.reactToQEnabled
            // to force the $scope.filters watcher to run
            //$rootScope.$watchTrue(function () {
            $scope.$watch(function () {
                return PostFilters.qEnabled;
            }, function () {
                if (PostFilters.qEnabled === true) {
                    $scope.filters.reactToQEnabled = $scope.filters.reactToQEnabled ? !$scope.filters.reactToQEnabled : true;
                }
            });
            // whenever filters change, reload the posts on the map
            $scope.$watch(function () {
                return $scope.filters;
            }, function (newValue, oldValue) {
                var diff = _.omit(newValue, function (value, key, obj) {
                    return _.isEqual(oldValue[key], value);
                });
                var diffLength = _.keys(diff).length;
                var qDiffOnly =  _.keys(diff).length === 1 && diff.hasOwnProperty('q');
                /**
                 * We only want to call reloadMapPosts if we :
                 * - Have changes other than q= in the filters
                 * - Only q= changed but we also have enabled the q filter
                 */
                if (diffLength > 0 && !qDiffOnly || (diffLength >= 1 && PostFilters.qEnabled === true)) {
                    $scope.cancelCurrentRequests();
                    $scope.clearData();
                    $scope.reloadMapPosts();
                }
                if (PostFilters.qEnabled === true) {
                    PostFilters.qEnabled = false;
                }
            }, true);
        };

        $scope.loadPosts = function (query, offset, currentBlock, clearPosts) {
            if (clearPosts === true) {
                $scope.posts = [];
            }
            offset = offset || 0;
            currentBlock = currentBlock || 1;

            query = query || PostFilters.getQueryParams($scope.filters);

            var conditions = _.extend(query, {
                limit: $scope.limit,
                offset: offset,
                has_location: 'mapped'
            });

            LoadingProgress.setLoadingState({isLoading: true});

            var request = PostEndpoint.geojson(conditions);
            $scope.currentGeoJsonRequests.push(request);

            return request.$promise.then(function (posts) {

                // Set number of chunks
                if (offset === 0 && posts.total > $scope.limit) {
                    $scope.numberOfChunks = Math.floor((posts.total - $scope.limit) / $scope.limit);
                    $scope.numberOfChunks += ((posts.total - $scope.limit) % $scope.limit) > 0 ? 1 : 0;
                }

                // Retrieve blocks of chunks
                // At the end of a block request the next block of chunks
                if ($scope.numberOfChunks > 0 && currentBlock === 1) {
                    var block = $scope.numberOfChunks > $scope.requestBlockSize ? $scope.requestBlockSize : $scope.numberOfChunks;
                    $scope.numberOfChunks -= $scope.requestBlockSize;
                    while (block > 0) {
                        block -= 1;
                        offset += $scope.limit;
                        $scope.loadPosts(query, offset, block).then($scope.addPostsToMap);
                    }
                }

                if ($scope.numberOfChunks <= 0) {
                    LoadingProgress.setLoadingState({isLoading: false});

                }
                return posts;
            });
        };

        function activate() {
            $scope.posts = $scope.loadPosts();
        }

        activate();
    }
];
