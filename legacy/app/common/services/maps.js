module.exports = Maps;

Maps.$inject = ['ConfigEndpoint', 'Leaflet', '_', 'CONST'];
function Maps(ConfigEndpoint, L, _, CONST) {

    // mapbox static tiles API styles
    // references:
    //   https://docs.mapbox.com/help/troubleshooting/migrate-legacy-static-tiles-api/#leaflet-implementations
    //   https://docs.mapbox.com/api/maps/#mapbox-styles
    function _mapboxStaticTiles(name, mapid) {
        return {
            name: name,
            url: 'https://api.mapbox.com/styles/v1/{mapid}/tiles/{z}/{x}/{y}?access_token={apikey}',
            layerOptions: {
                apikey: CONST.MAPBOX_API_KEY,
                tileSize: 512,
                maxZoom: 18,
                zoomOffset: -1,
                mapid: mapid,
                attribution: '&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>'
            }
        };
    }

    var layers = {
        baselayers : {
            satellite: _mapboxStaticTiles('Satellite', 'mapbox/satellite-v9'),
            streets: _mapboxStaticTiles('Streets', 'mapbox/streets-v11'),
            hOSM: {
                name: 'Humanitarian',
                url: '//{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
                layerOptions: {
                    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>, &copy; <a href="http://hot.openstreetmap.org/">Humanitarian OpenStreetMap</a> | <a href="https://www.mapbox.com/feedback/" target="_blank">Improve the underlying map</a>'
                }
            }
        }
    };

    return {
        createMap: createMap,
        getLeafletConfig: getLeafletConfig,
        getBaseLayers: getBaseLayers,
        pointToLayer: pointToLayer,
        getConfig: getConfig,
        getLayer: getLayer,
        pointIcon: pointIcon,
        defaultConfig: defaultConfig
    };

    function createMap(element) {
        return getLeafletConfig().then(function (config) {
            var map = L.map(element, config);
            map.attributionControl.setPrefix(false);
            map.zoomControl.setPosition('bottomleft');
            map.setMaxBounds([[-90,-360],[90,360]]);
            map.scrollWheelZoom.enable();
            map.on('popupopen', function (e) {
                var px = map.project(e.popup._latlng); // find the pixel location on the map where the popup anchor is
                px.y -= e.popup._container.clientHeight / 2; // find the height of the popup container, divide by 2, subtract from the Y axis of marker location
                map.panTo(map.unproject(px), {animate: true}); // pan to new center
            });

            // Add a layer control
            // L.control.layers(getBaseLayersForControl(), {}).addTo(map);
            var iconicSprite = require('ushahidi-platform-pattern-library/assets/img/iconic-sprite.svg');
            var resetButton  = L.easyButton({
                id: 'reset-button',
                position: 'bottomleft',
                type: 'replace',
                leafletClasses: true,
                states:[{
                    // specify different icons and responses for your button
                    stateName: 'reset-button',
                    onClick: function() {
                        var defaultview = defaultValues(config);
                        map.setView([defaultview.lat, defaultview.lon], defaultview.zoom);
                    },
                    title: 'Reset to default view',
                    icon: '<svg class="iconic" style="fill:black;"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="' + iconicSprite + '#home"></use></svg>'
                }]
            });

            resetButton.addTo(map);

            return map;
        });
    }

    function getLeafletConfig() {
        return getConfig().then(function (config) {
            var defaultLayer = layers.baselayers[config.default_view.baselayer];

            return angular.extend(defaultConfig(),
            {
                layers: [L.tileLayer(defaultLayer.url, defaultLayer.layerOptions)],
                center: [config.default_view.lat, config.default_view.lon],
                zoom: config.default_view.zoom,
                clustering: config.clustering,
                cluster_radius: Number(config.cluster_radius || 50)
            });
        });
    }

    function getBaseLayers() {
        return layers.baselayers;
    }
    /* eslint-disable */
    function getBaseLayersForControl() {
        return _.chain(layers.baselayers)
        .values()
        .indexBy('name')
        .mapObject(function (layer) {
            return L.tileLayer(layer.url, layer.layerOptions);
        })
        .value();
    }
    /* eslint-enable */

    function getLayer(layerKey) {
        var layer = layers.baselayers[layerKey];
        return L.tileLayer(layer.url, layer.layerOptions);
    }

    function getConfig(fresh) {
        return ConfigEndpoint[fresh ? 'getFresh' : 'get']({ id: 'map' }).$promise.then(function (config) {
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
            scrollWheelZoom: true,
            center: [-1.2833, 36.8167], // Default to centered on Nairobi
            zoom: 3,
            layers: [L.tileLayer(layers.baselayers.streets.url, layers.baselayers.streets.layerOptions)]
        };
    }

    function pointToLayer(feature, latlng) {
        return L.marker(latlng, {
            icon: pointIcon(feature.properties['marker-color'])
        });
    }
    // Icon configuration
    function pointIcon(color, size, className) {
        // Test string to make sure that it does not contain injection
        color = (color && /^[a-zA-Z0-9#]+$/.test(color)) ? color : '#959595';
        size = size || [32, 32];
        var iconicSprite = require('ushahidi-platform-pattern-library/assets/img/iconic-sprite.svg');

        return L.divIcon({
            className: 'custom-map-marker ' + className,
            html: '<svg class="iconic" style="fill:' + color + ';"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="' + iconicSprite + '#map-marker"></use></svg><span class="iconic-bg" style="background-color:' + color + ';""></span>',
            iconSize: size,
            iconAnchor: [size[0] / 2, size[1]],
            popupAnchor: [0, 0 - size[1]]
        });
    }

    // default view is centered on nairobi
    function defaultValues(config) {
        return {
            lat: config.center[0],
            lon: config.center[1],
            zoom: config.zoom
        }
    }

}
