module.exports = [function () {
    return {
        getMap: function () {
            return {$promise: {
                then: function (successCallback, failCallback) {
                    successCallback({
                        getMinZoom: function() { return 0;},
                        getMaxZoom: function () { return 0;}
                    });
                }
            }};
        },
        getInitialScope: function () {

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
 
