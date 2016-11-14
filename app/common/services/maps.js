module.exports = Maps;

Maps.$inject = ['ConfigEndpoint', 'Leaflet', '_', 'CONST'];
function Maps(ConfigEndpoint, L, _, CONST) {
    var layers = {
        baselayers : {
            satellite: {
                name: 'Satellite',
                url: 'https://api.tiles.mapbox.com/v4/{mapid}/{z}/{x}/{y}.png?access_token={apikey}',
                type: 'xyz',
                layerOptions: {
                    apikey: CONST.MAPBOX_API_KEY,
                    mapid: 'mapbox.satellite',
                    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>, &copy; <a href="https://www.mapbox.com/about/maps/"">Mapbox</a>'
                }
            },
            streets: {
                name: 'Streets',
                url: 'https://api.tiles.mapbox.com/v4/{mapid}/{z}/{x}/{y}.png?access_token={apikey}',
                type: 'xyz',
                layerOptions: {
                    apikey: CONST.MAPBOX_API_KEY,
                    mapid: 'mapbox.streets',
                    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>, &copy; <a href="https://www.mapbox.com/about/maps/"">Mapbox</a>'
                }
            },
            hOSM: {
                name: 'Humanitarian',
                url: 'http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
                type: 'xyz',
                layerOptions: {
                    attribution: 'Map data &copy; <a href="http://osm.org/copyright">OpenStreetMap</a>, Tiles <a href="http://hot.openstreetmap.org/">Humanitarian OpenStreetMap Team</a>'
                }
            }
        }
    };

    return {
        createMap: createMap,
        getMapConfig: getMapConfig,
        getBaseLayers: getBaseLayers,
        pointToLayer: pointToLayer
    };

    function createMap(element) {
        return getMapConfig().then(function (config) {
            var map = L.map(element, config);

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

            return map;
        });
    }

    function getMapConfig() {
        return getConfig().then(function (config) {
            var defaultLayer = layers.baselayers[config.default_view.baselayer];

            return angular.extend(defaultConfig(),
            {
                layers: [L.tileLayer(defaultLayer.url, defaultLayer.layerOptions)],
                center: [config.default_view.lat, config.default_view.lon],
                zoom: config.default_view.zoom
            });
        });
    }

    function getBaseLayers() {
        return _.chain(layers.baselayers)
        .values()
        .indexBy('name')
        .mapObject(function (layer) {
            return L.tileLayer(layer.url, layer.layerOptions);
        })
        .value();
    }

    function getConfig() {
        return ConfigEndpoint.get({ id: 'map' }).$promise.then(function (config) {
            // Handle legacy layers
            if (config.default_view.baselayer === 'MapQuest') {
                config.default_view.baselayer = 'streets';
            }
            if (config.default_view.baselayer === 'MapQuestAerial') {
                config.default_view.baselayer = 'satellite';
            }
            return config;
        });
    }

    function defaultConfig() {
        return {
            scrollWheelZoom: false,
            center: [-1.2833, 36.8167], // Default to centered on Nairobi
            zoom: 8,
            layers: [L.tileLayer(layers.baselayers.streets.url, layers.baselayers.streets.layerOptions)]
        };
    }

    function pointToLayer(feature, latlng) {
        return L.marker(latlng, {
            icon: pointIcon(feature, [32, 32])
        });
    }

    // Icon configuration
    function pointIcon(feature, size, className) {
        // Test string to make sure that it does not contain injection
        var color = (feature.properties['marker-color'] && /^[a-zA-Z0-9#]+$/.test(feature.properties['marker-color'])) ? feature.properties['marker-color'] : '#959595';
        var iconicSprite = require('ushahidi-platform-pattern-library/assets/img/iconic-sprite.svg');

        return L.divIcon({
            className: 'custom-map-marker ' + className,
            html: '<svg class="iconic" style="fill:' + color + ';"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="' + iconicSprite + '#map-marker"></use></svg><span class="iconic-bg" style="background-color:' + color + ';""></span>',
            iconSize: size,
            iconAnchor: [size[0] / 2, size[1]],
            popupAnchor: [0, 0 - size[1]]
        });
    }
}
