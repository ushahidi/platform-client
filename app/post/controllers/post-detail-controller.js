module.exports = [
    '$scope',
    '$rootScope',
    'post',
    '$translate',
    '$q',
    '$filter',
    '$location',
    'PostEndpoint',
    'CollectionEndpoint',
    'UserEndpoint',
    'TagEndpoint',
    'FormAttributeEndpoint',
    'FormEndpoint',
    'Maps',
    'Leaflet',
    'leafletData',
    '_',
    'RoleHelper',
    'Notify',
function (
    $scope,
    $rootScope,
    post,
    $translate,
    $q,
    $filter,
    $location,
    PostEndpoint,
    CollectionEndpoint,
    UserEndpoint,
    TagEndpoint,
    FormAttributeEndpoint,
    FormEndpoint,
    Maps,
    L,
    leafletData,
    _,
    RoleHelper,
    Notify
) {
    $scope.post = post;
    $scope.mapDataLoaded = false;
    $scope.availableRoles = RoleHelper.roles();
    $scope.publishedFor = function () {
        if ($scope.post.status === 'draft') {
            return 'post.publish_for_you';
        }
        if (!_.isEmpty($scope.post.published_to)) {
            return RoleHelper.getRole($scope.post.published_to[0]);
        }

        return 'post.publish_for_everyone';
    };

    // Set page title to post title, if there is one available.
    if (post.title && post.title.length) {
        $scope.$emit('setPageTitle', post.title);
    } else {
        $translate('post.post_details').then(function (title) {
            $scope.title = title;
            $scope.$emit('setPageTitle', title);
        });
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
        return TagEndpoint.get({id: tag.id, ignore403: true});
    });

    $scope.showType = function (type) {
        if (type === 'point') {
            return false;
        }
        if (type === 'geometry') {
            return false;
        }

        return true;
    };

    // Set initial map params
    angular.extend($scope, Maps.getInitialScope());
    // Load map params, including config from server (async)
    var config = Maps.getAngularScopeParams();
    config.then(function (params) {
        angular.extend($scope, params);
    });

    // Load geojson
    var geojson = PostEndpoint.geojson({id: post.id});
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
    $q.all({
        config: config,
        geojson: geojson.$promise
    }).then(function (data) {
        if (data.geojson.features.length) {
            $scope.mapDataLoaded = true;
        }
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
            Notify.showConfirm(message).then(function () {
                PostEndpoint.delete({ id: $scope.post.id }).$promise.then(function () {
                    $translate(
                        'notify.post.destroy_success',
                        {
                            name: $scope.post.title
                        }).then(function (message) {
                            Notify.showNotificationSlider(message);
                            $location.path('/');
                        });
                });
            });
        });
    };

    $scope.refreshCollections = function () {
        $scope.editableCollections = CollectionEndpoint.editableByMe();
    };
    $scope.refreshCollections();
    $scope.postInCollection = function (collection) {
        return _.contains($scope.post.sets, String(collection.id));
    };

    $scope.toggleCreateCollection = function () {
        $scope.showNewCollectionInput = !$scope.showNewCollectionInput;
    };

    $scope.toggleCollection = function (selectedCollection) {
        if (_.contains($scope.post.sets, String(selectedCollection.id))) {
            $scope.removeFromCollection(selectedCollection);
        } else {
            $scope.addToCollection(selectedCollection);
        }
    };

    $scope.addToCollection = function (selectedCollection) {
        var collectionId = selectedCollection.id, collection = selectedCollection.name;

        CollectionEndpoint.addPost({'collectionId': collectionId, 'id': $scope.post.id})
            .$promise.then(function () {
                $translate('notify.collection.add_to_collection', {collection: collection})
                .then(function (message) {
                    $scope.post.sets.push(String(collectionId));
                    Notify.showNotificationSlider(message);
                });
            }, function (errorResponse) {
                Notify.showApiErrors(errorResponse);
            });
    };

    $scope.removeFromCollection = function (selectedCollection) {
        var collectionId = selectedCollection.id, collection = selectedCollection.name;

        CollectionEndpoint.removePost({'collectionId': collectionId, 'id': $scope.post.id})
        .$promise
        .then(function () {
            $translate('notify.collection.removed_from_collection', {collection: collection})
            .then(function (message) {
                $scope.post.sets = _.without($scope.post.sets, String(collectionId));
                Notify.showNotificationSlider(message);
            });
        }, function (errorResponse) {
            Notify.showApiErrors(errorResponse);
        });
    };
    /*
    scope.searchCollections = function (query) {
        CollectionEndpoint.query(query)
        .$promise
        .then(function (result) {
        }, function (errorResponse) {
            Notify.showApiErrors(errorResponse);
        });
    };

    scope.clearSearch = function() {
        scope.editableCollection = scope.editableCollectionCopy;
    };
    */
    $scope.createNewCollection = function (collectionName) {
        var collection = {
            'name': collectionName,
            'user_id': $rootScope.currentUser.userId
        };
        CollectionEndpoint.save(collection)
        .$promise
        .then(function (collection) {
            $scope.toggleCreateCollection();
            $scope.newCollection = '';
            $scope.refreshCollections();
            $scope.addToCollection(collection);
        }, function (errorResponse) {
            Notify.showApiErrors(errorResponse);
        });
    };

    $scope.publishPostTo = function () {
        // first check if stages required have been marked complete
        var requiredStages = _.where($scope.stages, {required: true}),
            errors = [];

        _.each(requiredStages, function (stage) {
            // if this stage isn't complete, add to errors
            if (_.indexOf($scope.post.completed_stages, stage.id) === -1) {
                errors.push($filter('translate')('post.modify.incomplete_step', { stage: stage.label }));
            }
        });

        if (errors.length) {
            Notify.showAlerts(errors);
            return;
        }

        if ($scope.publishRole) {
            if ($scope.publishRole === 'draft') {
                $scope.post.status = 'draft';
            } else {
                $scope.post.status = 'published';
                $scope.post.published_to = [$scope.publishRole];
            }
        } else {
            $scope.post.status = 'published';
            $scope.post.published_to = [];
        }

        PostEndpoint.update($scope.post).
        $promise
        .then(function () {
            var message = post.status === 'draft' ? 'notify.post.set_draft' : 'notify.post.publish_success';
            $translate(message, { role: $scope.publishRole })
            .then(function (message) {
                Notify.showNotificationSlider(message);
            });
        }, function (errorResponse) {
            Notify.showApiErrors(errorResponse);
        });
    };

    $scope.postIsPublishedTo = function () {
        if ($scope.post.status === 'draft') {
            return 'draft';
        }

        if (!_.isEmpty($scope.post.published_to)) {
            return $scope.post.published_to[0];
        }

        return '';
    };
    $scope.publishRole = $scope.postIsPublishedTo();

}];

