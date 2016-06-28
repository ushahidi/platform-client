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
    'FormStageEndpoint',
    'FormEndpoint',
    'Maps',
    'leafletData',
    '_',
    'Notify',
    'moment',
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
    FormStageEndpoint,
    FormEndpoint,
    Maps,
    leafletData,
    _,
    Notify,
    moment
) {
    $rootScope.setLayout('layout-c');
    $scope.post = post;
    $scope.hasPermission = $rootScope.hasPermission;

    $scope.mapDataLoaded = false;
    $scope.publishedFor = function () {
        if ($scope.post.status === 'draft') {
            return 'post.publish_for_you';
        }
        if (!_.isEmpty($scope.post.published_to)) {
            return $scope.post.published_to.join(', ');
        }

        return 'post.publish_for_everyone';
    };

    $scope.setVisibleStage = function (stageId) {
        $scope.visibleStage = stageId;
    };

    $scope.stageIsComplete = function (stageId) {
        return _.includes($scope.post.completed_stages, stageId);
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
        $scope.post.user = UserEndpoint.get({id: $scope.post.user.id});
    }

    // Load the post form
    if ($scope.post.form && $scope.post.form.id) {
        $scope.form_attributes = [];

        FormEndpoint.get({id: $scope.post.form.id}, function (form) {
            $scope.form_name = form.name;
            $scope.form_description = form.description;

            // Set page title to '{form.name} Details' if a post title isn't provided.
            if (!$scope.post.title) {
                $translate('post.type_details', { type: form.name }).then(function (title) {
                    $scope.$emit('setPageTitle', title);
                });
            }
        });

        FormStageEndpoint.get({formId: $scope.post.form.id}, function (stages) {
            $scope.stages = stages.results;

            // Convert ids to strings
            _.forEach($scope.stages, function (stage) {
                stage.id = stage.id.toString();
            });

            // Make the first stage visible
            if (!_.isEmpty($scope.stages)) {
                $scope.visibleStage = $scope.stages[0].id;
                $scope.stages[0].hasFileIcon = true;
            }

            // Get completed stages
            _.forEach($scope.stages, function (stage) {
                if (_.indexOf($scope.post.completed_stages, stage.id) !== -1) {
                    stage.completed = true;
                }
            });
        });

        FormAttributeEndpoint.query({formId: $scope.post.form.id}, function (attributes) {
            angular.forEach(attributes, function (attr) {
                this[attr.key] = attr;
            }, $scope.form_attributes);
        });
    } else {
        $scope.visibleStage = 'post';
    }

    $scope.isFirstStage = function (stageId) {
        if (!_.isEmpty($scope.stages)) {
            return stageId === $scope.stages[0].id;
        }

        return false;
    };

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


    $scope.activateStageTab = function (selectedStage) {
        $scope.visibleStage = selectedStage.id;
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

    $scope.toggleCompletedStage = function (stage) {
        // @todo how to validate this before saving
        if (_.includes($scope.post.completed_stages, stage.id)) {
            $scope.post.completed_stages = _.without($scope.post.completed_stages, stage.id);
        } else {
            $scope.post.completed_stages.push(stage.id);
        }

        PostEndpoint.update($scope.post).$promise
            .then(function () {
                Notify.notify('notify.post.stage_save_success', {stage: stage.label});
                stage.completed = !stage.completed;
            }, function (errorResponse) {
                Notify.apiErrors(errorResponse);
            });
    };

    $scope.publishPostTo = function (updatedPost) {
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
            Notify.errorsPretranslated(errors); // todo WTF
            return;
        }

        $scope.post = updatedPost;

        PostEndpoint.update($scope.post).
        $promise
        .then(function () {
            var message = post.status === 'draft' ? 'notify.post.set_draft' : 'notify.post.publish_success';
            var role = message === 'draft' ? 'draft' : (_.isEmpty(post.published_to) ? 'everyone' : post.published_to.join(', '));

            Notify.notify(message, {role: role});
        }, function (errorResponse) {
            Notify.apiErrors(errorResponse);
        });
    };

    function formatDate() {
        var created = moment($scope.post.update || $scope.post.created),
            now = moment();

        if (now.isSame(created, 'day')) {
            $scope.displayTime = created.fromNow();
        } else {
            $scope.displayTime = created.format('LLL');
        }
    }

    formatDate();
}];
