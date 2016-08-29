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

    // Ensure completed_stages are dealt with as ints
    // This should be changed on the API
    post.completed_stages = post.completed_stages.map(function (stageId) {
        return parseInt(stageId);
    });

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

        $scope.post_task_id = undefined;

        $q.all([
            FormEndpoint.get({id: $scope.post.form.id}),
            FormStageEndpoint.query({formId:  $scope.post.form.id}).$promise,
            FormAttributeEndpoint.query({formId: $scope.post.form.id}).$promise
        ]).then(function (results) {
            $scope.form_name = results[0].name;
            $scope.form_description = results[0].description;
            $scope.form_color = results[0].color;

            // Set page title to '{form.name} Details' if a post title isn't provided.
            if (!$scope.post.title) {
                $translate('post.type_details', { type: results[0].name }).then(function (title) {
                    $scope.$emit('setPageTitle', title);
                });
            }
            var tasks = _.sortBy(results[1], 'priority');
            var attrs = _.chain(results[2])
                .sortBy('priority')
                .value();

            var attributes = [];
            _.each(attrs, function (attr) {
                if (!_.contains($scope.attributesToIgnore, attr.key)) {
                    attributes.push(attr);
                }
            });
            attributes = (attributes.length) ? attributes : attrs;

            angular.forEach(attributes, function (attr) {
                this[attr.key] = attr;

            }, $scope.form_attributes);

            // Make the first task visible
            if (!_.isEmpty(tasks) && tasks.length > 1) {
                $scope.visibleTask = tasks[1].id;
                tasks[1].hasFileIcon = true;
            }

            _.each(tasks, function (task) {

                // Set post task id
                // NOTE: This assumes that there is only one Post task per Post
                if (task.type === 'post') {
                    $scope.post_task = task;
                } else {
                    // Mark completed tasks
                    if (_.indexOf($scope.post.completed_stages, task.id) !== -1) {
                        task.completed = true;
                    }
                }
            });

            // Remove post task from tasks
            tasks = _.filter(tasks, function (task) {
                return task.type !== 'post';
            });

            $scope.tasks = tasks;
            $scope.removeEmptyTasks();
        });
    }

    $scope.removeEmptyTasks = function () {
        var tasks_with_attributes = [];
        _.each($scope.post.values, function (value, key) {
            if ($scope.form_attributes[key]) {
                tasks_with_attributes.push($scope.form_attributes[key].form_stage_id);
            }
        });
        tasks_with_attributes = _.uniq(tasks_with_attributes);

        $scope.tasks = _.filter($scope.tasks, function (task) {
            return _.contains(tasks_with_attributes, task.id);
        });
    };

    $scope.showTasks = function () {
        return $scope.tasks.length > 1;
    };

    $scope.isPostValue = function (key) {
        return $scope.form_attributes[key].form_stage_id === $scope.post_task.id;
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

    $scope.activateTaskTab = function (selectedTaskId) {
        $scope.visibleTask = selectedTaskId;
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

    $scope.toggleCompletedTask = function (task) {
        // @todo how to validate this before saving
        if (_.includes($scope.post.completed_stages, task.id)) {
            $scope.post.completed_stages = _.without($scope.post.completed_stages, task.id);
        } else {
            $scope.post.completed_stages.push(task.id);
        }

        PostEndpoint.update($scope.post).$promise
            .then(function () {
                Notify.notify('notify.post.stage_save_success', {stage: task.label});
                task.completed = !task.completed;
            }, function (errorResponse) {
                Notify.apiErrors(errorResponse);
            });
    };

    $scope.publishPostTo = function (updatedPost) {
        // first check if tasks required have been marked complete
        var requiredTasks = _.where($scope.tasks, {required: true}),
            errors = [];

        _.each(requiredTasks, function (task) {
            // if this stage isn't complete, add to errors
            if (_.indexOf($scope.post.completed_stages, task.id) === -1) {
                errors.push($filter('translate')('post.modify.incomplete_step', { stage: task.label }));
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
