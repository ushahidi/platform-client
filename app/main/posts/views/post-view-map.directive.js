module.exports = PostViewMap;

PostViewMap.$inject = ['PostEndpoint', 'Maps', '_', 'PostFilters', 'Leaflet', '$q', '$rootScope', '$compile', '$location', '$timeout', '$state', '$translate'];
function PostViewMap(PostEndpoint, Maps, _, PostFilters, L, $q, $rootScope, $compile, $location, $timeout, $state, $translate) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            noui: '@',
            $transition$: '<',
            filters: '<'
        },
        template: require('./post-view-map.html'),
        link: PostViewMapLink
    };

    function PostViewMapLink($scope, element, attrs, controller) {
        var map, markers;
        var limit = 200;
        var requestBlockSize = 5;
        var numberOfChunks = 0;
        var currentGeoJsonRequests = [];

        activate();

        function activate() {
            // Set the page title
            $translate('post.posts').then(function (title) {
                $scope.title = title;
                $scope.$emit('setPageTitle', title);
            });

            // Grab initial filters
            //$scope.filters = PostFilters.getFilters();

            var posts = loadPosts();

            // Start loading data
            var mapSelector = $scope.noui ? '#map-noui' : '#map-full-size';
            var createMapDirective =  Maps.createMap(element[0].querySelector(mapSelector));
            var createMap = createMapDirective.then(function (data) {
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
                .then(watchFilters);

            // Change state on mode change
            $scope.$watch(() => {
                return PostFilters.getModeId();
            }, (mode) => {
                if (PostFilters.getMode() === 'savedsearch') {
                    $state.go('posts.map.savedsearch', {savedSearchId: PostFilters.getModeId()});
                } else if (PostFilters.getMode() === 'collection') {
                    $state.go('posts.map.collection', {collectionId: PostFilters.getModeId()});
                } else {
                    $state.go('posts.map.all');
                }
            });

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
            $timeout(function () {
                map.invalidateSize();
            }, 1);
        }

        function watchFilters() {
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
                    cancelCurrentRequests();
                    clearData();
                    reloadMapPosts();
                }
                if (PostFilters.qEnabled === true) {
                    PostFilters.qEnabled = false;
                }
            }, true);
        }

        function cancelCurrentRequests() {
            _.each(currentGeoJsonRequests, function (request) {
                request.$cancelRequest();
            });
            currentGeoJsonRequests = [];
        }

        function reloadMapPosts(query) {
            var test = loadPosts(query);
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
                return posts;
            });
        }

        function goToPost(post) {
            // reload because otherwise the layout does not reload and that is wrong because we change layouts on data and map
            $state.go('posts.data.detail', {postId: post.id}, {reload: true});
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
                        scope.goToPost = goToPost;
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
        }

        function getPostDetails(feature) {
            return PostEndpoint.get({id: feature.properties.id}).$promise;
        }

    }
}
