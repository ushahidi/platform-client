module.exports = [
    '$scope',
    'leafletData',
    'Maps',
    function (
        $scope,
        leafletData,
        Maps
    ) {
        angular.extend($scope, Maps.getInitialScope());
        Maps.getAngularScopeParams().then(function (params) {
            angular.extend($scope, params);
            $scope.mapReady = true;
        });
        angular.extend($scope, {
            controls: {
                scale: true,
                draw: {
                    marker: false,
                    polyline: false,
                    circle: false
                }

            }
        });

        angular.extend($scope.layers, {
            overlays: {
                draw: {
                    name: 'draw',
                    type: 'group',
                    visible: true,
                    layerParams: {
                        showOnSelector: false
                    }
                }
            }
        });

        // console.log($scope);

        leafletData.getMap('map').then(function (map) {
            leafletData.getLayers().then(function (baselayers) {
                var drawnItems = baselayers.overlays.draw;
                map.on('draw:created', function (e) {
                    var layer = e.layer;
                    drawnItems.addLayer(layer);
                    console.log(JSON.stringify(layer.toGeoJSON()));
                });

                // map.on('draw:deleted', function(e) {
                //     var layers = e.layers;
                //     layers.eachLayer(function(layer) {
                //         if (layer.hasLayer) {
                //             layer.removeLayer(feature);
                //         }
                //     });
                // });

            });
        });

    }
];
