module.exports = [
    '$http',
    'leafletData',
    'Geocoding',
    'Maps',
    '_',
function (
    $http,
    leafletData,
    Geocoding,
    Maps,
    _
) {

    return {
        restrict: 'E',
        replace: true,
        scope: {
            id: '@',
            name: '@',
            model: '=',
            required: '='
        },
        templateUrl: 'templates/posts/location.html',
        controller: [
            '$window',
            '$scope',
            'Leaflet',
        function (
            $window,
            $scope,
            Leaflet
        ) {
            var markers = {},
                mapName = $scope.id + '-map';

            angular.extend($scope, Maps.getInitialScope());

            // Try to use value from settings
            var config = Maps.getAngularScopeParams();

            config.then(function (params) {
                // Save initial center for reset
                $scope.initialCenter = params.center;

                // If we already have a location wipe the center
                if ($scope.model) {
                    delete params.center;
                }
                // Then save params into scope
                angular.extend($scope, params);
            });

            // init markers with current model value
            if ($scope.model) {
                markers = {
                    m1 : {
                        lat: $scope.model.lat,
                        lng: $scope.model.lon
                    }
                };

                $scope.center = {
                    lat: $scope.model.lat,
                    lng: $scope.model.lon,
                    zoom: 4
                };
            }

            // leaflet map or location attribute
            angular.extend($scope, {
                markers: markers,

                updateLatLon: function (lat, lon) {
                    $scope.model = {
                        lat: lat,
                        lon: lon
                    };
                },

                updateMarkerPosition: function (lat, lon) {
                    $scope.markers.m1 = {
                        lat: lat,
                        lng: lon
                    };
                },

                centerMapTo: function (lat, lon) {
                    $scope.center = {
                        lat : lat,
                        lng : lon,
                        zoom: 4
                    };
                },

                searchLocation: function () {
                    var that = this;
                    $scope.processing = true;

                    Geocoding.search($scope.searchLocationTerm).then(function (coordinates) {
                        $scope.processing = false;

                        if (!coordinates) {
                            return;
                        } // @todo - handle lookup error

                        _.each([
                            'updateLatLon', 'updateMarkerPosition', 'centerMapTo'
                        ], function (fn) {
                            that[fn](coordinates[0], coordinates[1]);
                        });

                        $scope.searchLocationTerm = '';
                    });
                },

                clear: function () {
                    $scope.model = null;
                    $scope.center = $scope.initialCenter;
                    $scope.markers = {};
                }
            });

            leafletData.getMap(mapName).then(function (map) {
                map.on('click', onMapClick);
                function onMapClick(e) {
                    var wrappedLatLng = e.latlng.wrap(),
                        lat = wrappedLatLng.lat,
                        lon = wrappedLatLng.lng;

                    $scope.updateMarkerPosition(lat, lon);
                    $scope.updateLatLon(lat, lon);
                }

                // Add locate control, but only on https
                if (window.location.protocol === 'https:' || window.location.hostname === 'localhost') {
                    Leaflet.control.locate({
                        follow: true
                    }).addTo(map);
                }

                // treate locationfound same as map click
                map.on('locationfound', onMapClick);
            });
        }]
    };

}];
