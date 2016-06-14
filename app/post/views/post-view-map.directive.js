module.exports = [
function (
) {
    var controller = [
        '$scope',
        'PostEndpoint',
        'FormAttributeEndpoint',
        'MediaEndpoint',
        'Maps',
        '_',
        'PostFilters',
        '$q',
        'moment',
    function (
        $scope,
        PostEndpoint,
        FormAttributeEndpoint,
        MediaEndpoint,
        Maps,
        _,
        PostFilters,
        $q,
        moment
    ) {
        // Set initial map params
        angular.extend($scope, Maps.getInitialScope());
        // Load map params, including config from server (async)
        Maps.getAngularScopeParams().then(function (params) {
            angular.extend($scope, params);
        });

        Maps.getMap().init();

        // load geojson posts into the map obeying the global filter settings
        var map = Maps.getMap('map');
        var reloadMapPosts = function (query) {
            query = query || PostFilters.getQueryParams($scope.filters);

            $scope.isLoading = true;

            var postDetailPromises = [];

            return PostEndpoint.geojson(query).$promise.then(function (posts) {
                _.each(posts.features, function (feature) {
                    postDetailPromises.push(getPostDetails(feature));
                });

                $q.all(postDetailPromises).then(function (postDetails) {
                    _.each(postDetails, function (detail, key) {
                        var updated = detail.update || detail.created;

                        detail.displayTime = displayTime(updated);
                        detail.displayTimeFull = displayTimeFull(updated);
                        detail.visibleTo = visibleTo(detail);

                        posts.features[key].detail = detail;
                    });

                    map.reloadPosts(posts);
                    $scope.isLoading = false;
                });
            });
        };

        var displayTime = function (date) {
            var created = moment(date),
                now = moment();

            if (now.isSame(created, 'day')) {
                return created.fromNow();
            } else if (now.isSame(created, 'week')) {
                return created.format('LT');
            } else {
                return created.format('LL');
            }
        };

        var displayTimeFull = function (date) {
            return moment(date).format('LLL');
        };

        var visibleTo = function (post) {
            if (post.status === 'draft') {
                return 'draft';
            }

            if (!_.isEmpty(post.published_to)) {
                return post.published_to.join(', ');
            }

            return 'everyone';
        };

        var getPostDetails = function (feature) {
            var attributes = [], deferred = $q.defer(), mediaId;

            PostEndpoint.get({id: feature.properties.id}).$promise.then(function (post) {
                // Grab form attributes
                FormAttributeEndpoint.get({formId: post.form.id}).$promise.then(function (response) {
                    angular.forEach(response.results, function (attr) {
                        this[attr.key] = attr;
                    }, attributes);

                    // ...and look for a media attribute
                    _.each(post.values, function (value, key) {
                        if (attributes[key].type === 'media') {
                            mediaId = value[0];
                        }
                    });

                    if (mediaId) {
                        MediaEndpoint.get({id: mediaId}).$promise.then(function (media) {
                            post.media = media;
                            deferred.resolve(post);
                        });
                    } else {
                        deferred.resolve(post);
                    }
                });
            });

            return deferred.promise;
        };

        // whenever filters change, reload the posts on the map
        $scope.$watch(function () {
            return $scope.filters;
        }, function (newValue, oldValue) {
            if (newValue !== oldValue) {
                reloadMapPosts();
            }
        }, true);

        // Initial load
        reloadMapPosts();
    }];

    return {
        restrict: 'E',
        replace: true,
        scope: {
            filters: '=',
            isLoading: '='
        },
        controller: controller,
        templateUrl: 'templates/posts/views/post-view-map.html'
    };
}];
