module.exports = ['leafletData', '$http', function(leafletData, $http){
    return {
        restrict: 'E',
        replace: true,
        scope: {
            attribute: '=',
            values: '=',
            key: '='
        },
        templateUrl: 'templates/posts/location.html',
        controller: ['$window', 'Leaflet', '$scope', '$geolocation', function($window, Leaflet, $scope, $geolocation) {

            var marker = null;

            // leaflet map or location attribute
            angular.extend($scope, {
                defaults: {
                    scrollWheelZoom: false
                },

                center: {
                    lat: 36.079868,
                    lng: -79.819416,
                    zoom: 4
                },

                updateLatLon: function(lat, lon){
                    if($scope.values[$scope.attribute.key] !== null)
                    {
                        $scope.values[$scope.attribute.key] = {};
                    }
                    if($scope.values[$scope.attribute.key][$scope.key] !== null)
                    {
                        $scope.values[$scope.attribute.key][$scope.key] = {};
                    }

                    $scope.values[$scope.attribute.key][$scope.key].lat = lat;
                    $scope.values[$scope.attribute.key][$scope.key].lon = lon;
                },


                updateMarkerPosition: function(lat, lon){
                    leafletData.getMap($scope.attribute.key).then(function(map){
                        if(marker !== null)
                        {
                            map.removeLayer(marker);
                        }

                        marker = new Leaflet.Marker(new Leaflet.latLng(lat, lon), {draggable:true});
                        map.addLayer(marker);

                    });
                },

                centerMapTo: function(lat, lon){
                    leafletData.getMap($scope.attribute.key).then(function(map) {
                        map.panTo(new Leaflet.LatLng(lat, lon));
                    });
                },

                searchLocation: function(event){
                    event.preventDefault();
                    var that = this;
                    $http.get('http://nominatim.openstreetmap.org/search?q=' + $window.escape($scope.searchLocationTerm) + '&format=json').success(
                        function(data, status, headers, config){
                            var lat = data[0].lat,
                            lon = data[0].lon;

                            that.updateLatLon(lat, lon);
                            that.updateMarkerPosition(lat, lon);
                            that.centerMapTo(lat, lon);
                            $scope.searchLocationTerm = '';
                        }
                    );
                }
            });

            leafletData.getMap($scope.attribute.key).then(function(map) {
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
            });
        }]
    };
}];
