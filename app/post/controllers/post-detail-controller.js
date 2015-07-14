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
    'FormEndpoint',
    'Maps',
    'Leaflet',
    'leafletData',
function (
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
    FormEndpoint,
    Maps,
    L,
    leafletData
) {
    $translate('post.post_details').then(function (title) {
        $scope.title = title;
        $scope.$emit('setPageTitle', title);
    });
    $scope.mapDataLoaded = false;

    $scope.showType = function (type) {
        if (type === 'point') {
            return false;
        }
        if (type === 'geometry') {
            return false;
        }

        return true;
    };

    $scope.post = PostEndpoint.get({ id: $routeParams.id }, function (post) {
        // Set page title to post title, if there is one available.
        if (post.title && post.title.length) {
            $scope.$emit('setPageTitle', post.title);
        }

        // Load the post author
        if ($scope.post.user && $scope.post.user.id) {
            $scope.user = UserEndpoint.get({id: $scope.post.user.id});
        }

        // Load the post form
        if ($scope.post.form && $scope.post.form.id) {
            $scope.form_attributes = [];

            FormEndpoint.get({id: $scope.post.form.id}, function (form) {
                $scope.form_name = form.name;

                // Set page title to '{form.name} Details' if a post title isn't provided.
                if (!$scope.post.title) {
                    $translate('post.type_details', { type: form.name }).then(function (title) {
                        $scope.$emit('setPageTitle', title);
                    });
                }
            });

            FormAttributeEndpoint.query({formId: $scope.post.form.id}, function (attributes) {
                angular.forEach(attributes, function (attr) {
                    this[attr.key] = attr;
                }, $scope.form_attributes);
            });
        }

        // Replace tags with full tag object
        $scope.post.tags = $scope.post.tags.map(function (tag) {
            return TagEndpoint.get({id: tag.id});
        });
    });

    // Set initial map params
    angular.extend($scope, Maps.getInitialScope());
    // Load map params, including config from server (async)
    var config = Maps.getAngularScopeParams();
    config.then(function (params) {
        angular.extend($scope, params);
    });

    // Load geojson
    var geojson = PostEndpoint.geojson({id: $routeParams.id});
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

    // Show map once data loaded
    $q.all(
        config,
        geojson.$promise
    ).then(function () {
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
        $translate('notify.post.destroy_confirm').then(function (message) {
            if (window.confirm(message)) {
                PostEndpoint.delete({ id: $scope.post.id }).$promise.then(function () {
                    $location.path('/');
                });
            }
        });
    };
}];
