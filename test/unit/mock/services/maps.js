module.exports = ['$q', function ($q) {
    return {
        createMap: function () {
            return $q.when({
                        options: {
                            clustering: false
                        }
                    });
        },
        getConfig: function () {
            return {
                then: function (successCallback) {
                    successCallback({
                        cluster_radius: 50,
                        clustering: false,
                        id: 'map',
                        default_view: {
                            baselayer: 'MapQuestAerial',
                            color: 'blue',
                            fit_map_boundaries: true,
                            icon: 'map-marker',
                            lat: -1.3048035,
                            lon: 36.8473969,
                            zoom: 3
                        }
                    });
                }
            };
        },
        getBaseLayers: function () {
            return {
                satellite: {
                    name: 'Satellite',
                    url: 'https://api.tiles.mapbox.com/v4/{mapid}/{z}/{x}/{y}.png?access_token={apikey}',
                    layerOptions: {
                        apikey: 'abc123',
                        mapid: 'mapbox.satellite',
                        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>, &copy; <a href="https://www.mapbox.com/about/maps/"">Mapbox</a>'
                    }
                },
                streets: {
                    name: 'Streets',
                    url: 'https://api.tiles.mapbox.com/v4/{mapid}/{z}/{x}/{y}.png?access_token={apikey}',
                    layerOptions: {
                        apikey: 'abc123',
                        mapid: 'mapbox.streets',
                        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>, &copy; <a href="https://www.mapbox.com/about/maps/"">Mapbox</a>'
                    }
                },
                hOSM: {
                    name: 'Humanitarian',
                    url: 'http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
                    layerOptions: {
                        attribution: 'Map data &copy; <a href="http://osm.org/copyright">OpenStreetMap</a>, Tiles <a href="http://hot.openstreetmap.org/">Humanitarian OpenStreetMap Team</a>'
                    }
                }
            };
        },
        getLayer: () => {
            return {};
        },
        pointIcon: () => {
            return {};
        }
    };
}];
