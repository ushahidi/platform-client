module.exports = LocationPickerDirective;

LocationPickerDirective.$inject = ['$http', 'Leaflet', 'Geocoding', 'Maps', '_', 'Notify', '$window'];

function LocationPickerDirective($http, L, Geocoding, Maps, _, Notify, $window) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            id: '@',
            name: '@',
            default: '=',
            model: '=',
            required: '='
        },
        template: require('./location-picker.html'),
        link: LocationPickerLink
    };

    function LocationPickerLink($scope, element, attrs) {
        var currentPositionControl, map, marker,
            zoom = 8;

        $scope.processing = false;
        $scope.searchLocationTerm = '';
        $scope.searchLocation = searchLocation;
        $scope.clear = clear;

        // for dropdown
        $scope.showDropdown = false;
        $scope.showSearchResults = showSearchResults;
        $scope.hideSearchResults = hideSearchResults;
        $scope.chooseLocation = chooseLocation;
        $scope.chooseCurrentLocation = chooseCurrentLocation;
        $scope.searchResults = [];
        $scope.showCurrentPositionControl = false;
        activate();

        function activate() {
            Maps.createMap(element[0].querySelector('.map'))
            .then(function (data) {
                map = data;

                // If default property provided, set model to default value
                if ($scope.default) {
                    $scope.model = $scope.default;
                }

                // If model was stringified for save, parse model into object
                if (typeof $scope.model === 'string') {
                    $scope.model = JSON.parse($scope.model);
                }

                // init marker with current model value
                if ($scope.model &&
                    typeof $scope.model.lat !== 'undefined' &&
                    typeof $scope.model.lon !== 'undefined'
                ) {
                    updateMarkerPosition($scope.model.lat, $scope.model.lon);
                    centerMapTo($scope.model.lat, $scope.model.lon);
                }
                map.on('click', onMapClick);
                // treat locationfound same as map click
                map.on('locationfound', onMapClick);
                // Add locate control, but only on https
                if (window.location.protocol === 'https:' || window.location.hostname === 'localhost') {
                    $scope.showCurrentPositionControl = true;
                    currentPositionControl = L.control.locate({
                        follow: true
                    }).addTo(map);
                }
                // @todo: Should we watch the model and update map?

                // Ensure map is fully loaded with modal and switch
                setTimeout(function () {
                    map.invalidateSize();
                });

            });
        }


        function onMapClick(e) {
            var wrappedLatLng = e.latlng.wrap(),
                lat = wrappedLatLng.lat,
                lon = wrappedLatLng.lng;

            updateMarkerPosition(lat, lon);
            updateModelLatLon(lat, lon);
        }

        function updateModelLatLon(lat, lon) {
            $scope.model = {
                lat: lat,
                lon: lon
            };

            // Update parent scope when editing default location
            if ($scope.$parent.editAttribute) {
                $scope.$parent.editAttribute.default = $scope.model;
            }

        }

        function updateMarkerPosition(lat, lon) {
            if (marker) {
                marker.setLatLng([lat, lon]);
            } else {
                marker = L.marker([lat, lon], {
                    draggable: true,
                    icon: Maps.pointIcon()
                });
                marker.addTo(map);

                marker.on('dragend', function (ev) {
                    var latLng = ev.target.getLatLng();
                    updateModelLatLon(latLng.lat, latLng.lng);
                });
            }
        }

        function centerMapTo(lat, lon) {
            map.setView([lat, lon], zoom);
        }

        function clear() {
            $scope.model = null;
            if (marker) {
                map.removeLayer(marker);
                marker = null;
            }
        }

        // for dropdown
        function showSearchResults() {
            $scope.showDropdown = true;
        }

        function hideSearchResults() {
            $scope.showDropdown = false;
        }

        function searchLocation() {
            Geocoding.searchAllInfo($scope.searchLocationTerm).then(function (results) {
                $scope.searchResults = results;
            });
        }

        function chooseLocation(location) {
            $scope.searchLocationTerm = '';
            updateModelLatLon(location.lat, location.lon);
            updateMarkerPosition(location.lat, location.lon);
            centerMapTo(location.lat, location.lon);
            $scope.hideSearchResults();
        }

        function chooseCurrentLocation() {
            currentPositionControl.start();
            $scope.hideSearchResults();
        }
    }
}
