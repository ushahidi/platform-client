module.exports = LocationFilterDirective;

LocationFilterDirective.$inject = ['Geocoding', '$q'];
function LocationFilterDirective(Geocoding, $q) {
    return {
        restrict: 'E',
        scope: {
            centerPointModel: '=',
            withinKmModel: '='
        },
        require: '^form',
        link: LocationFilterLink,
        templateUrl: 'templates/posts/views/filters/filter-location.html'
    };

    //LocationFilterLink.$inject = ['Geocoding'];
    function LocationFilterLink($scope, element, attrs, formCtrl) {
        $scope.geocoding = false;
        $scope.locationSearchText = '';

        $scope.$watch('centerPointModel', updateStateFromModels);
        $scope.$watch('locationSearchText', updateModelsFromState);

        function updateStateFromModels(newValue, oldValue) {
            if (!$scope.locationSearchText) {
                $scope.locationSearchText = $scope.centerPointModel;
            }
        }

        function updateModelsFromState() {
            if ($scope.locationSearchText) {
                geocode($scope.locationSearchText).then(function (coords) {
                    $scope.centerPointModel = coords;
                });
            } else {
                $scope.centerPointModel = '';
            }
        }

        function geocode(location) {
            var defer = $q.defer(),
                valid_coords = /\-?[0-9]+(\.[0-9]+)?\s*,\s*\-?[0-9]+(\.[0-9]+)?/;

            if (!location) {
                return;
            }

            if (valid_coords.test(location)) {
                defer.resolve(location);
            } else { // perform a geocoding lookup on the location
                $scope.geocoding = true;

                Geocoding.search(location).then(function (coordinates) {
                    if (!coordinates) {
                        defer.reject();
                        return;
                    } // @todo - handle bad lookup

                    $scope.geocoding = false;
                    defer.resolve(coordinates[0] + ',' + coordinates[1]);
                });
            }

            return defer.promise;
        }
    }
}

