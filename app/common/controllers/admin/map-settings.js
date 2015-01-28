module.exports = [
    '$scope',
    '$translate',
    'ConfigEndpoint',
    'PostEndpoint',
function(
    $scope,
    $translate,
    ConfigEndpoint,
    PostEndpoint
) {

    $translate('map_settings.admin_map_settings').then(function(mapSettingsTranslation){
        $scope.title = mapSettingsTranslation;
    });

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

    $scope.map = ConfigEndpoint.get({ id: 'map' });
    PostEndpoint.query().$promise.then(function(postsResponse){
        $scope.posts = postsResponse.results;
    });

}];
