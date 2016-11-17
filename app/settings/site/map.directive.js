module.exports = [
    '$q',
    'ConfigEndpoint',
    'Leaflet',
    'Maps',
function (
    $q,
    ConfigEndpoint,
    L,
    Maps
) {
    return {
        restrict: 'E',
        scope: {
            config: '='
        },
        template: require('./map.html'),
        link: function ($scope, $element, $attrs) {
            var map, marker;

            $scope.patternDigitsOnly = /^[0-9]+$/;
            $scope.patternFloat = /[-+]?(\d*[.])?\d+/;
            $scope.minZoom = 0;
            $scope.maxZoom = 18;
            $scope.updateMapPreview = updateMapPreview;
            $scope.updateMapPreviewLayer = updateMapPreviewLayer;

            activate();

            function activate() {
                $scope.baselayers = Maps.getBaseLayers();

                // Set initial map params
                $q.all({
                    map: Maps.createMap($element[0].querySelector('#settings-map')),
                    config: Maps.getConfig(true)
                }).then(function (data) {
                    map = data.map;
                    angular.extend($scope.config, data.config);

                    marker = L.marker(map.getCenter(), {
                        draggable: true,
                        icon: Maps.pointIcon()
                    });
                    marker.addTo(map);

                    // Get zoom limits from leaflet
                    getMapZoomLevels();

                    // Set up event handlers
                    marker.on('dragend', handleDragEnd);
                    map.on('zoomend', handleMoveEnd);
                    map.on('click', handleClick);
                });
            }

            // Get this map's available zoom levels.
            function getMapZoomLevels() {
                $scope.minZoom = map.getMinZoom();
                $scope.maxZoom = map.getMaxZoom();
            }

            function updateMapPreviewLayer() {
                // Set the preview map's tileset to the current default.
                map.eachLayer(function (layer) {
                    if (layer instanceof L.TileLayer) {
                        layer.remove();
                    }
                });
                Maps.getLayer($scope.config.default_view.baselayer).addTo(map);
            }

            // Update map view from config
            function updateMapPreview() {
                // Center the map at our current default.
                // Set the zoom level to our default zoom.
                map.setView(
                    [$scope.config.default_view.lat, $scope.config.default_view.lon],
                    $scope.config.default_view.zoom
                );

                // Update our draggable marker to the default.
                marker.setLatLng([$scope.config.default_view.lat, $scope.config.default_view.lon]);
            }

            // Update our map defaults when the marker is dragged to a new spot.
            function handleDragEnd(e) {
                $scope.$evalAsync(function () {
                    var latLng = e.target.getLatLng().wrap();
                    $scope.config.default_view.lat = latLng.lat;
                    $scope.config.default_view.lon = latLng.lng;

                    $scope.updateMapPreview();
                });
            }

            function handleClick(e) {
                $scope.$evalAsync(function () {
                    var latLng = e.latlng.wrap();
                    $scope.config.default_view.lat = latLng.lat;
                    $scope.config.default_view.lon = latLng.lng;

                    $scope.updateMapPreview();
                });
            }

            // Update our default zoom level when the preview map's is changed.
            function handleMoveEnd(e) {
                $scope.$evalAsync(function () {
                    $scope.config.default_view.zoom = map.getZoom();
                });
            }
        }
    };
}];
