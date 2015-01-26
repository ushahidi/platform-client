module.exports = [
    '$scope',
    'ConfigEndpoint',
    'PostEndpoint',
function(
    $scope,
    ConfigEndpoint,
    PostEndpoint
) {

    $scope.title = 'Map View';

    angular.extend($scope, {
        defaults: {
            scrollWheelZoom: false
        },
        center: {
            lat: 36.079868,
            lng: -79.819416,
            zoom: 4
        },
        markers: {
            osloMarker: {
                lat: 36.079868,
                lng: -79.819416,
                focus: true,
                draggable: false
            }
        }
    });

    $scope.map = ConfigEndpoint.get({ id: 'map' });
    PostEndpoint.query().$promise.then(function(postsResponse){
        $scope.posts = postsResponse.results;
    });

}];
