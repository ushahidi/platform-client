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

            // use default values in case there are none in the config
            var center = {
                lat: 36.079868,
                lng: -79.819416,
                zoom: 4
            };

            $scope.center = center;

            // Save original center for reset
            $scope.initialCenter = center;

            // Try to use value from settings
            var config = Maps.getAngularScopeParams();

            config.then(function (params) {
                if (!$scope.model && params.center) {
                    $scope.center = params.center;
                    $scope.initialCenter = params.center;
                }
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
                defaults: {
                    scrollWheelZoom: false
                },

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
                    Geocoding.search($scope.searchLocationTerm).then(function (coordinates) {
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
                    console.log($scope.initialCenter);
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

                Leaflet.control.locate({
                    follow: true
                }).addTo(map);

                // treate locationfound same as map click
                map.on('locationfound', onMapClick);
            });
        }]
    };

}];
