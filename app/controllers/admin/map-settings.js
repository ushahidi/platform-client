module.exports = ['$scope', 'ConfigMapEndpoint', 'PostEndpoint', function($scope, ConfigMapEndpoint, PostEndpoint) {
    $scope.title = 'Admin: Map Settings';

    angular.extend($scope, {
        defaults: {
            scrollWheelZoom: false
        },
        markers: {
            osloMarker: {
                lat: 36.079868,
                lng: -79.819416,
                message: 'Welcome to Greensboro, NC',
                focus: true,
                draggable: false
            }
        }
    });

    $scope.map = ConfigMapEndpoint.get();
    $scope.posts = PostEndpoint.query();

}];
