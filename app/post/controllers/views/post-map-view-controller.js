module.exports = [
    '$q',
    '$scope',
    '$translate',
    'ConfigEndpoint',
    'PostEndpoint',
    'GlobalFilter',
    'Maps',
    '_',
function (
    $q,
    $scope,
    $translate,
    ConfigEndpoint,
    PostEndpoint,
    GlobalFilter,
    Maps,
    _
) {

    $translate('post.posts').then(function (title) {
        $scope.title = title;
        $scope.$emit('setPageTitle', title);
    });

    // todo: this should be fetched from Maps, but the call is async and
    // this needs to apply to the scope immediately for the leaflet directive.
    var layers = {
        baselayers : {
            MapQuest: {
                name: 'MapQuest',
                url: 'http://otile{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.png',
                type: 'xyz',
                layerOptions: {
                    subdomains: '1234',
                    attribution: 'Map data &copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors, Imagery &copy; <a href="http://info.mapquest.com/terms-of-use/">MapQuest</a>'
                }
            },
            MapQuestAerial: {
                name: 'MapQuest Aerial',
                url: 'http://otile{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.png',
                type: 'xyz',
                layerOptions: {
                    subdomains: '1234',
                    attribution: 'Map data &copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors, Imagery &copy; <a href="http://info.mapquest.com/terms-of-use/">MapQuest</a>'
                }
            },
            hOSM: {
                name: 'Humanitarian OSM',
                url: 'http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
                type: 'xyz',
                layerOptions: {
                    attribution: 'Map data &copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors, Tiles courtesy of <a href="http://hot.openstreetmap.org/">Humanitarian OpenStreetMap Team</a>'
                }
            }
        }
    };

    angular.extend($scope, {
        title: 'Map View', // translate?
        defaults: {
            scrollWheelZoom: false
        },
        center: { // Default to centered on Nairobi
            lat: -1.2833,
            lng: 36.8167,
            zoom: 8
        },
        layers: layers
    });

    Maps.getAngularScopeParams().then(function (params) {
        angular.extend($scope, params);
    });

    // load geojson posts into the map obeying the global filter settings
    var map = Maps.getMap('map');
    var reloadMapPosts = function () {
        var map_posts = PostEndpoint.get(_.extend(
            GlobalFilter.getPostQuery(), { extra: 'geojson' }
        ));
        map_posts.$promise.then(map.reloadPosts);
    };

    reloadMapPosts(); // init

    // whenever the global filter query changes, reload the posts on the map
    $scope.$watchCollection(function () {
        return JSON.stringify(GlobalFilter.getPostQuery());
    }, function (newValue, oldValue) {
        reloadMapPosts();
    });

}];
