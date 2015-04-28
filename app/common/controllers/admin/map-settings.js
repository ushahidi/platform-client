module.exports = [
    '$scope',
    '$translate',
    'PostEndpoint',
    'ConfigEndpoint',
function(
    $scope,
    $translate,
    PostEndpoint,
    ConfigEndpoint
) {

    $translate('map_settings.admin_map_settings').then(function(mapSettingsTranslation){
        $scope.title = mapSettingsTranslation;
        $scope.$emit('setPageTitle', mapSettingsTranslation);
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
    PostEndpoint.query().$promise.then(function(response) {
        $scope.posts = response.results;
    });

}];
