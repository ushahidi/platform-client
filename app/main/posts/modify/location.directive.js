module.exports = PostLocationDirective;

PostLocationDirective.$inject = ['$http', 'Leaflet', 'Geocoding', 'Maps', '_', 'Notify', '$window'];
function PostLocationDirective($http, L, Geocoding, Maps, _, Notify, $window) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            id: '@',
            name: '@',
            model: '=',
            required: '='
        },
        template: require('./location.html'),
        link: PostLocationLink
    };

    function PostLocationLink($scope, element, attrs) {
        var map, marker,
            zoom = 8;

        $scope.processing = false;
        $scope.searchLocationTerm = '';
        $scope.searchLocation = searchLocation;
        $scope.clear = clear;
        $scope.showDropdown = false;
        $scope.showSearchResults = showSearchResults;
        $scope.hideSearchResults = hideSearchResults;

        activate();

        function activate() {
            Maps.createMap(element[0].querySelector('.post-location-map'))
            .then(function (data) {
                map = data;

                // init marker with current model value
                if ($scope.model &&
                    typeof $scope.model.lat !== 'undefined' &&
                    typeof $scope.model.lon !== 'undefined'
                ) {
                    updateMarkerPosition($scope.model.lat, $scope.model.lon);
                    centerMapTo($scope.model.lat, $scope.model.lon);
                }

                map.on('click', onMapClick);
                // treate locationfound same as map click
                map.on('locationfound', onMapClick);

                // Add locate control, but only on https
                if (window.location.protocol === 'https:' || window.location.hostname === 'localhost') {
                    L.control.locate({
                        follow: true
                    }).addTo(map);
                }

                // @todo: Should we watch the model and update map?
            });
        }
        function showSearchResults() {
            $scope.showDropdown = true;
        }

        function hideSearchResults() {
            $scope.showDropdown = false;
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

        function searchLocation() {
            $scope.processing = true;

            Geocoding.search($scope.searchLocationTerm).then(function (coordinates) {
                $scope.processing = false;

                if (!coordinates) {
                    Notify.error('location.error');
                    return;
                }

                updateModelLatLon(coordinates[0], coordinates[1]);
                updateMarkerPosition(coordinates[0], coordinates[1]);
                centerMapTo(coordinates[0], coordinates[1]);

                $scope.searchLocationTerm = '';
            });
        }

        function clear() {
            $scope.model = null;
            if (marker) {
                map.removeLayer(marker);
                marker = null;
            }
        }
    }
}
