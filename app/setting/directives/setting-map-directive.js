module.exports = [
    '$q',
    '$translate',
    'ConfigEndpoint',
    'leafletEvents',
    'leafletData',
    'Maps',
    'Notify',
function (
    $q,
    $translate,
    ConfigEndpoint,
    leafletEvents,
    leafletData,
    Maps,
    Notify
) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            map: '='
        },
        templateUrl: 'templates/settings/general/settings-map.html',
        link: function ($scope, $element, $attrs) {
            $scope.patternDigitsOnly = /^[0-9]+$/;
            $scope.patternFloat = /[-+]?(\d*[.])?\d+/;

            // Set initial map params
            angular.extend($scope, Maps.getInitialScope());

            $scope.minZoom = 0;
            $scope.maxZoom = 18;
            $q.all([Maps.getAngularScopeParams(), Maps.getConfig()]).then(function (config) {
                var view = config[0],
                    map = config[1];

                $scope.map = map;

                $scope.baseLayers = view.layers.baselayers;

                // Create a draggable marker for changing the default center.
                $scope.markers = {
                    dragger: {
                        lat: map.default_view.lat,
                        lng: map.default_view.lon,
                        focus: true,
                        draggable: true
                    }
                };

                // Get this map's available zoom levels.
                $scope.getMapZoomLevels = function () {
                    leafletData.getMap().then(function (map) {
                        $scope.minZoom = map.getMinZoom();
                        $scope.maxZoom = map.getMaxZoom();
                    });
                };

                $scope.updateMapPreview = function () {
                    // Set the preview map's tileset to the current default.
                    $scope.baselayer = $scope.baseLayers[map.default_view.baselayer];

                    // Center the map at our current default.
                    $scope.center = {
                        lat: map.default_view.lat,
                        lng: map.default_view.lon,
                        zoom: map.default_view.zoom
                    };

                    // Update our draggable marker to the default.
                    $scope.markers.dragger.lat = map.default_view.lat;
                    $scope.markers.dragger.lng = map.default_view.lon;

                    // Set the zoom level to our default zoom.
                    leafletData.getMap().then(function (map) {
                        map.setZoom($scope.map.default_view.zoom);
                    });
                };

                $scope.getMapZoomLevels();
                $scope.updateMapPreview();

                $scope.mapSettingsReady = true;
            });

            // Update our map defaults when the marker is dragged to a new spot.
            $scope.$on('leafletDirectiveMarker.dragend', function (event, args) {
                $scope.map.default_view.lat = args.leafletEvent.target._latlng.lat;
                $scope.map.default_view.lon = args.leafletEvent.target._latlng.lng;
            });

            // Update our default zoom level when the preview map's is changed.
            $scope.$on('leafletDirectiveMap.moveend', function (event) {
                leafletData.getMap().then(function (map) {
                    $scope.map.default_view.zoom = map.getZoom();
                });
            });
        }
    };
}];
