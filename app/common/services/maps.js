module.exports = [
    '$q',
    'ConfigEndpoint',
    'Util',
    'Leaflet',
    'leafletData',
    '_',
function (
    $q,
    ConfigEndpoint,
    Util,
    L,
    LData,
    _
) {

    var layers = {
        baselayers : {
            MapQuest: {
                name: 'MapQuest',
                url: 'http://otile{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.png',
                type: 'xyz',
                layerOptions: {
                    subdomains: '1234',
                    attribution: 'Map data &copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors, Imagery &copy; <a href="http://info.mapquest.com/terms-of-use/">MapQuest</a>'
                }
            },
            MapQuestAerial: {
                name: 'MapQuest Aerial',
                url: 'http://otile{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.png',
                type: 'xyz',
                layerOptions: {
                    subdomains: '1234',
                    attribution: 'Map data &copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors, Imagery &copy; <a href="http://info.mapquest.com/terms-of-use/">MapQuest</a>'
                }
            },
            hOSM: {
                name: 'Humanitarian OSM',
                url: 'http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
                type: 'xyz',
                layerOptions: {
                    attribution: 'Map data &copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors, Tiles courtesy of <a href="http://hot.openstreetmap.org/">Humanitarian OpenStreetMap Team</a>'
                }
            }
        }
    };
    // Copy layersOptions to options to allow for differing formats
    // use by leaflet directive tiles vs layers
    angular.forEach(layers.baselayers, function (layer) {
        layer.options = layer.layerOptions;
    });

    var Maps = {
        maps: {},
        config: undefined,
        getMap: function (name) {
            if (!this.maps[name]) {
                this.maps[name] = Object.create(Map).init(name);
            }
            return this.maps[name];
        },
        getInitialScope: function () {
            return {
                defaults: {
                    scrollWheelZoom: false
                },
                center: { // Default to centered on Nairobi
                    lat: -1.2833,
                    lng: 36.8167,
                    zoom: 8
                },
                layers: layers
            };
        },
        getAngularScopeParams: function () {
            var deferred = $q.defer();

            this.getConfig().then(function (config) {
                // Set active baselayer
                var localLayers = angular.copy(layers);
                if (localLayers.baselayers[config.default_view.baselayer]) {
                    localLayers.baselayers[config.default_view.baselayer].top = true;
                }
                deferred.resolve({
                    layers: localLayers,
                    center: {
                        lat: config.default_view.lat,
                        lng: config.default_view.lon,
                        zoom: config.default_view.zoom
                    }
                });
            });

            return deferred.promise;
        },
        getConfig: function () {
            var deferred = $q.defer();

            if (this.config) {
                deferred.resolve(this.config);
            } else {
                this.reloadMapConfig().then(function (config) {
                    deferred.resolve(config);
                });
            }

            return deferred.promise;
        },
        reloadMapConfig: function () {
            return ConfigEndpoint.get({ id: 'map' }).$promise.then(_.bind(function (config) {
                this.config = config;
                return this.config;
            }, this));
        }
    };

    var Map = {
        map_name: undefined,
        leaflet_map: undefined,
        layers: {
            geojson: undefined,
            cluster: undefined
        },
        init: function (name) {
            this.map_name = name;

            // Disable 'Leaflet prefix on attributions'
            this.map().then(function (map) {
                map.attributionControl.setPrefix(false);
            });

            return this;
        },
        map: function () {
            var deferred = $q.defer();

            if (this.leaflet_map) {
                deferred.resolve(this.leaflet_map);
            } else {
                LData.getMap(this.map_name).then(function (map) {
                    this.leaflet_map = map;
                    deferred.resolve(this.leaflet_map);
                });
            }

            return deferred.promise;
        },
        reloadPosts: function (posts) {
            this.clearOldMarkers()
                .then(_.partial(this.setGeojsonLayer, posts))
                .then(this.addNewMarkers)
                ;
        },
        setGeojsonLayer: function (posts) {
            this.layers.geojson = L.geoJson(posts, {
                onEachFeature: function (feature, layer) {
                    layer.bindPopup(
                        '<strong><a href="/posts/' + feature.properties.id + '">' +
                        feature.properties.title +
                        '</a></strong>' +
                        '<p>' + feature.properties.description + '</p>'
                    );
                }
            });
        },
        clearOldMarkers: function () {
            var deferred = $q.defer();

            this.map().then(_.bind(function (map) {
                _.each(this.layers, function (layer, name) {
                    if (layer) {
                        map.removeLayer(layer);
                    }
                });

                deferred.resolve();
            }, this));

            return deferred.promise;
        },
        addNewMarkers: function () {
            Maps.getConfig().then(_.bind(function (config) {
                if (config.clustering === true) {
                    this.layers.cluster = L.markerClusterGroup({
                        maxClusterRadius: config.cluster_radius
                    });

                    // This has to be done individually.
                    // Using clusterLayer.addLayers() breaks the clustering.
                    angular.forEach(this.layers.geojson.getLayers(), _.bind(function (layer) {
                        this.layers.cluster.addLayer(layer);
                    }, this));
                }

                var markers = this.layers.cluster || this.layers.geojson;

                if (!markers) {
                    return;
                }

                this.map().then(function (map) {
                    map.addLayer(markers);

                    if (config.default_view.fitDataOnMap === true) {
                        // Center map on geojson
                        var bounds = markers.getBounds();
                        if (bounds.isValid()) {
                            map.fitBounds(bounds);
                        }

                        // Avoid zooming further than 15 (particularly when we just have a single point)
                        if (map.getZoom() > 15) {
                            map.setZoom(15);
                        }
                    }
                });
            }, this));
        }
    };

    Util.bindAllFunctionsToSelf(Map);
    return Util.bindAllFunctionsToSelf(Maps);

}];
