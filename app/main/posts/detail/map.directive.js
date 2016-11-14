module.exports = PostDetailMap;

PostDetailMap.$inject = ['PostEndpoint', 'Maps', '_', 'PostFilters', 'Leaflet', '$q', '$rootScope', '$compile'];
function PostDetailMap(PostEndpoint, Maps, _, PostFilters, L, $q, $rootScope, $compile) {
    return {
        restrict: 'E',
        scope: {
            postId: '='
        },
        link: DetailMapLink,
        template: require('./map.html')
    };

    function DetailMapLink($scope, element, attrs) {
        var map;
        $scope.hideMap = false;

        activate();

        function activate() {
            // Start loading data
            var geojson = PostEndpoint.geojson({id: $scope.postId}).$promise;
            var createMap = Maps.createMap(element[0].querySelector('#post-map'))
            .then(function (data) {
                map = data;
            });

            // When data is loaded
            $q.all({
                map: createMap,
                geojson: geojson
            })
            // Create the map
            .then(addGeoJSONToMap)
            ;

            // Cleanup leaflet map
            $scope.$on('$destroy', function () {
                if (map) {
                    map.remove();
                }
            });
        }

        function addGeoJSONToMap(data) {
            var geojsonData = data.geojson;
            // If theres no location data, drop out now
            if (geojsonData.features && geojsonData.features.length === 0) {
                $scope.hideMap = true;
                return;
            }

            var geojson = L.geoJson(geojsonData, {
                pointToLayer: Maps.pointToLayer
            });
            geojson.addTo(map);

            // Focus map on data points but..
            // Avoid zooming further than 15 (particularly when we just have a single point)
            map.fitBounds(geojson.getBounds());
            if (map.getZoom() > 15) {
                map.setZoom(15);
            }
        }
    }
}
