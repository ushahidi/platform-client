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
        var map, markers, posts;
        var geoJsonLayers = [];
        var currentGeoJsonRequests = [];
        $scope.stats = {totalItems: 0, filteredPosts:0, unmapped: 0};

        activate();

        function activate() {
            // Set the page title
            $translate('post.posts').then(function (title) {
                $scope.title = title;
                $scope.$emit('setPageTitle', title);
            });
            //Grabbing stats for filters-dropdown
            getStats();
            // Grab initial filters
            //$scope.filters = PostFilters.getFilters();


            // Start loading data
            var mapSelector = $scope.noui ? '#map-noui' : '#map-full-size';
            var createMapDirective =  Maps.createMap(element[0].querySelector(mapSelector));
            var createMap = createMapDirective.then(function (data) {
                map = data;
                posts = loadPosts().then(() => {
                    watchFilters();
                });
            });

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
            if (geoJsonLayers.length > 0) {
                angular.forEach(geoJsonLayers, function (layer) {
                    //map.removeLayer(layer)
                    layer.clearLayers();
                });
                markers = undefined;
                geoJsonLayers = [];
            }
        }

        function addPostsToMap(posts) {
            var geojson = L.geoJson(posts, {
                pointToLayer: Maps.pointToLayer,
                onEachFeature: onEachFeature
            });

            if (map.options.clustering) {

                markers = markers ? markers : L.markerClusterGroup({
                    maxClusterRadius: map.options.cluster_radius
                });
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
            geoJsonLayers.push(markers);

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
            // whenever filters change, reload the posts on the map
            $scope.$watch(function () {
                return $scope.filters;
            }, function (newValue, oldValue) {
                var diff = _.omit(newValue, function (value, key, obj) {
                    return _.isEqual(oldValue[key], value);
                });
                var diffLength = _.keys(diff).length;

                if (diffLength > 0) {
                    cancelCurrentRequests();
                    clearData();
                    reloadMapPosts();
                    getStats();
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
            loadPosts(query);
        }

        function getStats () {
            // Getting stats for filter-dropdown
            getPostStats(PostFilters.getDefaults()).$promise.then(function (result) {
                $scope.stats.totalItems = result.totals[0].values.reduce(
                    function (a,b) {
                        return a.total + b.total
                    }
                ) - result.unmapped;

                $scope.stats.unmapped = result.unmapped;
            });
        }

        function getPostStats(filters) {
            var query = PostFilters.getQueryParams(filters);
            var queryParams = _.extend({}, query, {
                include_unmapped: true,
                status: 'all'
            });

            // we don't want a group_by or filter
            if (queryParams.form) {
                delete queryParams.form;
            }
            if (queryParams.group_by) {
                delete queryParams.group_by;
            }

            // deleting source, we want stats for all datasources to keep the datasource-bucket-stats unaffected by data-source-filters
            if (queryParams.source) {
                delete queryParams.source;
            }
            return PostEndpoint.stats(queryParams);
        }

        function loadPosts(query) {
            let offset = 0;
            let limit = 200;
            query = query || PostFilters.getQueryParams($scope.filters);
            let conditions = _.extend(query, {
                limit: limit,
                offset: offset,
                has_location: 'mapped'
            });

            let getFirstPostChunk = PostEndpoint.geojson(conditions);
            currentGeoJsonRequests.push(getFirstPostChunk);
            return getFirstPostChunk.$promise.then(function (posts) {
                // Adding the first 200 posts to map here and getting the totals
                $scope.stats.filteredPosts = posts.total;
                addPostsToMap(posts)

                // Moving on to request rest of the posts
                if (posts.total > limit) {
                    for (let i = limit; i < posts.total; i = i + limit) {
                        conditions.offset = i;
                        let request = PostEndpoint.geojson(conditions);
                        currentGeoJsonRequests.push(request);
                        request.$promise.then(result => {
                            addPostsToMap(result)
                        });

                    }
                }
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
