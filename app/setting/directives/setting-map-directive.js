module.exports = [
    '$q',
    '$translate',
    'ConfigEndpoint',
    'leafletData',
    'Maps',
    'Notify',
function (
    $q,
    $translate,
    ConfigEndpoint,
    leafletData,
    Maps,
    Notify
) {
    return {
        restrict: 'E',
        scope: {
            map: '='
        },
        templateUrl: 'templates/settings/general/settings-map.html',
        link: function ($scope, $element, $attrs) {
            $scope.patternDigitsOnly = /^[0-9]+$/;
            $scope.patternFloat = /[-+]?(\d*[.])?\d+/;
            $scope.minZoom = 0;
            $scope.maxZoom = 18;
            $scope.getMapZoomLevels = getMapZoomLevels;
            $scope.updateMapPreview = updateMapPreview;

            activate();

            function activate() {
                // Set initial map params
                angular.extend($scope, Maps.getInitialScope());
                $scope.baselayer = $scope.layers.baselayers.MapQuest;
                $scope.markers = {
                    dragger: {
                        lat: $scope.center.lat,
                        lng: $scope.center.lon,
                        focus: true,
                        draggable: true
                    }
                };

                // Get zoom limits from leaflet
                $scope.getMapZoomLevels();

                // Set up event handlers
                $scope.$on('leafletDirectiveMarker.dragend', handleDragEnd);
                $scope.$on('leafletDirectiveMap.moveend', handleMoveEnd);

                // Get map config
                Maps.getConfig().then(function (map) {
                    $scope.map = map;

                    // Init values from map config
                    $scope.updateMapPreview();

                    $scope.mapSettingsReady = true;
                });
            }

            // Get this map's available zoom levels.
            function getMapZoomLevels() {
                leafletData.getMap().then(function (map) {
                    $scope.minZoom = map.getMinZoom();
                    $scope.maxZoom = map.getMaxZoom();
                });
            }

            // Update map view from config
            function updateMapPreview() {
                // Set the preview map's tileset to the current default.
                $scope.baselayer = $scope.layers.baselayers[$scope.map.default_view.baselayer];

                // Center the map at our current default.
                $scope.center = {
                    lat: $scope.map.default_view.lat,
                    lng: $scope.map.default_view.lon,
                    zoom: $scope.map.default_view.zoom
                };

                // Update our draggable marker to the default.
                $scope.markers.dragger.lat = $scope.map.default_view.lat;
                $scope.markers.dragger.lng = $scope.map.default_view.lon;

                // Set the zoom level to our default zoom.
                leafletData.getMap().then(function (map) {
                    map.setZoom($scope.map.default_view.zoom);
                });
            }

            // Update our map defaults when the marker is dragged to a new spot.
            function handleDragEnd(event, args) {
                $scope.map.default_view.lat = args.leafletEvent.target._latlng.lat;
                $scope.map.default_view.lon = args.leafletEvent.target._latlng.lng;

                $scope.updateMapPreview();
            }

            // Update our default zoom level when the preview map's is changed.
            function handleMoveEnd(event) {
                leafletData.getMap().then(function (map) {
                    $scope.map.default_view.zoom = map.getZoom();
                });
            }
        }
    };
}];
