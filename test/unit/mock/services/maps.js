module.exports = [function () {
    return {
        getMap: function () {
            return {
                reloadPosts: function (posts) {},
                getMinZoom: function () {
                    return 0;
                },
                getMaxZoom: function () {
                    return 0;
                },
                init: function () {

                }
            };
        },
        destroyMap: function () {

        },
        getInitialScope: function () {
            return {
                layers : {
                    baselayers : {
                        mapQuest : {
                            name: 'Map',
                            url: 'http://otile{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.png',
                            type: 'xyz',
                            layerOptions: {
                                subdomains: '1234',
                                attribution: 'Map data &copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors, Imagery &copy; <a href="http://info.mapquest.com/terms-of-use/">MapQuest</a>'
                            }
                        }
                    }
                },
                center: {
                    lat: 0,
                    lon: 0,
                    zoom: 3
                }
            };
        },
        getAngularScopeParams : function () {
            return {
                then: function (successCallback) {
                    successCallback({
                        centre: {
                            lat: -1.3048035,
                            lng: 36.8473969,
                            zoom: 3
                        },
                        layers: {
                            baselayers: {}
                        }
                    });
                }
            };
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
        }
    };
}];
