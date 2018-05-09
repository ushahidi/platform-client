module.exports = PostLocationDirective;

PostLocationDirective.$inject = ['$document', '$http', 'Leaflet', 'Geocoding', 'Maps', '_', 'Notify', '$window'];
function PostLocationDirective($document, $http, L, Geocoding, Maps, _, Notify, $window) {
    return {
        restrict: 'E',
        replace: true,
        require: 'ngModel',
        scope: {
            id: '@',
            name: '@',
            required: '='
        },
        template: require('./location.html'),
        link: PostLocationLink
    };

    function PostLocationLink($scope, element, attrs, ngModel) {
        var currentPositionControl, map, marker,
            zoom = 8;

        $scope.processing = false;
        $scope.searchLocationTerm = '';
        $scope.searchLocation = searchLocation;
        $scope.manualModel = { lat: null, lon: null };
        $scope.searchTimeout;
        $scope.handleActiveSearch = handleActiveSearch;
        $scope.clear = clear;

        // for dropdown
        $scope.showSearchResults = showSearchResults;
        $scope.hideSearchResults = hideSearchResults;
        $scope.chooseLocation = chooseLocation;
        $scope.chooseCurrentLocation = chooseCurrentLocation;
        $scope.searchResults = [];
        $scope.showCurrentPositionControl = false;
        $scope.updateMapFromLatLon = updateMapFromLatLon;
        activate();

        function activate() {

            Maps.createMap(element[0].querySelector('.map'))
            .then(function (data) {
                map = data;

                // Init marker with current model value
                renderViewValue();

                // Update Map if model changes
                ngModel.$render = renderViewValue;

                map.on('click', onMapClick);
                // treat locationfound same as map click
                map.on('locationfound', onMapClick);
                // handle failure to find location
                map.on('locationerror', onLocationError);
                // Add locate control, but only on https
                if (window.location.protocol === 'https:' || window.location.hostname === 'localhost') {
                    $scope.showCurrentPositionControl = true;
                    currentPositionControl = L.control.locate({
                        locateOptions: {
                            maximumAge: 60000 // 1 minute
                        }
                    }).addTo(map);
                }
            });

            $document.on('click', onDocumentClick);
        }

        function onDocumentClick(event) {
            if (!element[0].querySelector('.searchbar').contains(event.target)) {
                $scope.hideSearchResults();
            }
        }

        function onMapClick(e) {
            $scope.$apply(() => {
                var wrappedLatLng = e.latlng.wrap(),
                    lat = wrappedLatLng.lat,
                    lon = wrappedLatLng.lng;

                updateMarkerPosition(lat, lon);
                updateModelLatLon(lat, lon);
            });
        }

        function onLocationError() {
            Notify.error('location.my_location_error');
        }

        function renderViewValue() {
            if (ngModel.$viewValue &&
                typeof ngModel.$viewValue.lat !== 'undefined' &&
                typeof ngModel.$viewValue.lon !== 'undefined'
            ) {
                updateMarkerPosition(ngModel.$viewValue.lat, ngModel.$viewValue.lon);
                centerMapTo(ngModel.$viewValue.lat, ngModel.$viewValue.lon);
                updateManualLatLon(ngModel.$viewValue.lat, ngModel.$viewValue.lon);
            }
        }

        function updateModelLatLon(lat, lon) {
            ngModel.$setViewValue({
                lat: lat,
                lon: lon
            });
            updateManualLatLon(lat, lon);
        }

        function updateManualLatLon(lat, lon) {
            $scope.manualModel.lat = lat;
            $scope.manualModel.lon = lon;
        }

        function updateMapFromLatLon(lat, lon) {
            updateMarkerPosition(lat, lon);
            centerMapTo(lat, lon);
            updateModelLatLon(lat, lon);
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
                    $scope.$apply(() => {
                        var latLng = ev.target.getLatLng();
                        updateModelLatLon(latLng.lat, latLng.lng);
                    });
                });
            }
        }

        function centerMapTo(lat, lon) {
            map.setView([lat, lon], zoom);
        }

        function clear() {
            ngModel.$setViewValue(null);
            if (marker) {
                map.removeLayer(marker);
                marker = null;
            }
        }

        // for dropdown
        function showSearchResults() {
            element[0].querySelector('#searchbar-results').classList.add('active');
        }

        function hideSearchResults() {
            element[0].querySelector('#searchbar-results').classList.remove('active');
        }

        function handleActiveSearch(event) {
            var del = event.keyCode === 8 || event.keyCode === 46;
            var letter = event.keyCode > 47 && event.keyCode < 58;
            var number = event.keyCode > 64 && event.keyCode < 91;
            if (del || letter || number) {
                $scope.processing = true;
                if ($scope.searchTimeout) {
                    clearTimeout($scope.searchTimeout);
                }
                $scope.searchTimeout = setTimeout($scope.searchLocation, 250);
            }
            if (event.keyCode === 13) {
                event.preventDefault();
                return false;
            }
        }

        function searchLocation() {
            $scope.processing = true;
            Geocoding.searchAllInfo($scope.searchLocationTerm).then(function (results) {
                $scope.processing = false;
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
