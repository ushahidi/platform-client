module.exports = [
    '$scope',
    '$translate',
    '$routeParams',
    '$q',
    '$location',
    'PostEndpoint',
    'ConfigEndpoint',
    'UserEndpoint',
    'TagEndpoint',
    'FormAttributeEndpoint',
    'Leaflet',
    'leafletData',
function(
    $scope,
    $translate,
    $routeParams,
    $q,
    $location,
    PostEndpoint,
    ConfigEndpoint,
    UserEndpoint,
    TagEndpoint,
    FormAttributeEndpoint,
    L,
    leafletData
) {
    $translate('post.post_details').then(function(postDetailsTranslation){
        $scope.title = postDetailsTranslation;
    });

    $scope.showType = function(type) {
        if (type === 'point') {
            return false;
        }
        if (type === 'geometry') {
            return false;
        }

        return true;
    };

    $scope.post = PostEndpoint.get({id: $routeParams.id}, function() {
        // Load the post author
        if ($scope.post.user && $scope.post.user.id) {
            $scope.user = UserEndpoint.get({id: $scope.post.user.id});
        }

        // Load the post form
        if ($scope.post.form && $scope.post.form.id) {
            $scope.form_attributes = [];
            FormAttributeEndpoint.query({formId: $scope.post.form.id}, function(attributes) {
                angular.forEach(attributes, function(attr) {
                    this[attr.key] = attr;
                }, $scope.form_attributes);
            });
        }

        // Replace tags with full tag object
        $scope.post.tags = $scope.post.tags.map(function (tag) {
            return TagEndpoint.get({id: tag.id});
        });
    });

    // Map
    var layers = {
        baselayers : {
            mapquest: {
                name: 'MapQuest',
                url: 'http://otile{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.png',
                type: 'xyz',
                layerOptions: {
                    subdomains: '1234',
                    attribution: 'Map data &copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors, Imagery &copy; <a href="http://info.mapquest.com/terms-of-use/">MapQuest</a>',
                }
            },
            mapquestAerial: {
                name: 'MapQuest Aerial',
                url: 'http://otile{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.png',
                type: 'xyz',
                layerOptions: {
                    subdomains: '1234',
                    attribution: 'Map data &copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors, Imagery &copy; <a href="http://info.mapquest.com/terms-of-use/">MapQuest</a>',
                }
            },
            hOSM: {
                name: 'Humanitarian OSM',
                url: 'http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
                type: 'xyz',
                layerOptions: {
                    attribution: 'Map data &copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors, Tiles courtesy of <a href="http://hot.openstreetmap.org/">Humanitarian OpenStreetMap Team</a>'
                }
            },
        }
    };

    angular.extend($scope, {
        defaults: {
            scrollWheelZoom: false
        },
        center: {
            // Default to centered on Nairobi
            lat: -1.2833,
            lng: 36.8167,
            zoom: 8
        },
        layers : layers
    });

    // Load geojson
    var geojson = PostEndpoint.get({id: $routeParams.id, extra: 'geojson'});
    // Load geojson and pass to map
    geojson.$promise.then(function (data) {
        $scope.geojson = {
            data: data,
            onEachFeature: function (feature, layer) {
                var key = feature.properties.attribute_key;

                layer.bindPopup(
                    key
                );
            }
        };
    });

    // Load config
    var config = ConfigEndpoint.get({id:'map'});
    // Add map config to scope
    config.$promise.then(function(config) {
        // Add settings to scope
        // color, icon and baseLayer have been ignored
        angular.extend($scope, {
            center: {
                lat: config.default_view.lat,
                lng: config.default_view.lon,
                zoom: config.default_view.zoom
            },
            tiles: layers[config.default_view.baseLayer]
        });

        return config;
    });

    // Show map once data loaded
    $q.all(
        config.$promise,
        geojson.$promise
    ).then(function() {
        $scope.mapDataLoaded = true;
    });

    $q.all({
        map: leafletData.getMap('post-map'),
        geojson: leafletData.getGeoJSON('post-map')
    })
    // Set map options, add layers, and set bounds
    .then(function (data) {
        // Disable 'Leaflet prefix on attributions'
        data.map.attributionControl.setPrefix(false);

        // Center map on geojson
        data.map.fitBounds(data.geojson.getBounds());
        // Avoid zooming further than 15 (particularly when we just have a single point)
        if (data.map.getZoom() > 15) {
            data.map.setZoom(15);
        }
    });

    $scope.deletePost = function () {
        $translate('notify.post.destroy_confirm').then(function(message) {
            if (window.confirm(message)) {
                PostEndpoint.delete({ id: $scope.post.id }).$promise.then(function () {
                    $location.path('/');
                });
            }
        });
    };
}];
