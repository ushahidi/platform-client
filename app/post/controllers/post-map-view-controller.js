module.exports = [
    '$q',
    '$scope',
    'ConfigEndpoint',
    'PostEndpoint',
    'Leaflet',
    'leafletData',
function(
    $q,
    $scope,
    ConfigEndpoint,
    PostEndpoint,
    L,
    leafletData
) {
    var layers = {
        baselayers : {
            mapquest: {
                name: 'MapQuest',
                url: 'http://otile{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.png',
                type: 'xyz',
                layerOptions: {
                    subdomains: '1234',
                    attribution: 'Map data &copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors, Imagery &copy; <a href="http://info.mapquest.com/terms-of-use/">MapQuest</a>',
                }
            },
            mapquestAerial: {
                name: 'MapQuest Aerial',
                url: 'http://otile{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.png',
                type: 'xyz',
                layerOptions: {
                    subdomains: '1234',
                    attribution: 'Map data &copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors, Imagery &copy; <a href="http://info.mapquest.com/terms-of-use/">MapQuest</a>',
                }
            },
            hOSM: {
                name: 'Humanitarian OSM',
                url: 'http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
                type: 'xyz',
                layerOptions: {
                    attribution: 'Map data &copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors, Tiles courtesy of <a href="http://hot.openstreetmap.org/">Humanitarian OpenStreetMap Team</a>'
                }
            },
        }
    };

    angular.extend($scope, {
        defaults: {
            scrollWheelZoom: false
        },
        center: {
            // Default to centered on Nairobi
            lat: -1.2833,
            lng: 36.8167,
            zoom: 8
        },
        layers : layers
    });


    var geoJsonLayer = false,
        clusterLayer = false,
        fitDataOnMap = false;

    // Load posts geojson
    var geojson = PostEndpoint.get({extra:'geojson'});
    // Load map settings
    var config = ConfigEndpoint.get({id:'map'});

    // Create GeoJSON Layer
    geojson.$promise.then(function(geoJsonData) {
        geoJsonLayer = L.geoJson(geoJsonData, {
            onEachFeature: function (feature, layer) {
                layer.bindPopup(
                    '<strong><a href="/posts/'+feature.properties.id+'">' +
                    feature.properties.title +
                    '</a></strong>' +
                    '<p>'+feature.properties.description+'</p>'
                );
            }
        });
    });

    // Add map config to scope
    config.$promise.then(function(config) {
        // Add settings to scope
        // color, icon and baseLayer have been ignored
        angular.extend($scope, {
            center: {
                lat: config.default_view.lat,
                lng: config.default_view.lon,
                zoom: config.default_view.zoom
            },
            tiles: layers[config.default_view.baseLayer]
        });

        fitDataOnMap = config.default_view.fitDataOnMap;

        return config;
    });


    $q.all({
        geojson: geojson.$promise,
        config: config.$promise
    })
    // Init cluster group
    .then(function(data) {
        if (data.config.clustering === true) {
            // Create marker cluster layer
            clusterLayer = L.markerClusterGroup({
                maxClusterRadius: data.config.maxClusterRadius
            });

            // Add geojson layers to cluster layer
            // This has to be done individually. Using clusterLayer.addLayers() breaks the clustering.
            angular.forEach(geoJsonLayer.getLayers(), function(layer) {
                clusterLayer.addLayer(layer);
            });
        }
    })
    // Get map instance
    .then(function () { return leafletData.getMap('map'); })
    // Set map options, add layers, and set bounds
    .then(function (map) {
        // Disable 'Leaflet prefix on attributions'
        map.attributionControl.setPrefix(false);

        // Add clusters to map
        var markers = clusterLayer || geoJsonLayer;
        map.addLayer(markers);

        if (fitDataOnMap === true) {
            // Center map on geojson
            map.fitBounds(markers.getBounds());
            // Avoid zooming further than 15 (particularly when we just have a single point)
            if (map.getZoom() > 15) {
                map.setZoom(15);
            }
        }
    });

    $scope.title = 'Map View';

    $scope.map = ConfigEndpoint.get({ id: 'map' });

}];
