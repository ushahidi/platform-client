module.exports = PostDetailData;

PostDetailData.$inject = [];
function PostDetailData() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            post: '<',
            '$transition$': '<'
        },
        controller: PostDetailDataController,
        template: require('./post-detail-data.html')
    };
}

PostDetailDataController.$inject = [
    '$scope',
    '$rootScope',
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
    '_',
    'Notify',
    'moment',
    'PostSurveyService',
    '$state',
    '$window'
];
function PostDetailDataController(
    $scope,
    $rootScope,
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
    _,
    Notify,
    moment,
    PostSurveyService,
    $state,
    $window
) {
    $scope.$watch('post', function (post) {
        activate();
    });
    // /* need to check for embed here to set the correct class
    // * if coming from map to detail-view in embed, TODO: should go to a service! */
    // var isEmbed = ($window.self !== $window.top) ? true : false;
    // isEmbed ? $rootScope.setLayout('layout-d layout-embed') : $rootScope.setLayout('layout-d');

    $scope.post = $scope.post;
    $scope.post_task = {};
    $scope.hasPermission = $rootScope.hasPermission;
    $scope.canCreatePostInSurvey = PostSurveyService.canCreatePostInSurvey;
    $scope.mapDataLoaded = false;
    $scope.form_attributes = [];
    $scope.postValues = [];
    $scope.selectedPost = {post: $scope.post};

    activate();

    function activate() {
        // Set page title to post title, if there is one available.
        if ($scope.post.title && $scope.post.title.length) {
            $scope.$emit('setPageTitle', $scope.post.title);
        } else {
            $translate('post.post_details').then(function (title) {
                $scope.title = title;
                $scope.$emit('setPageTitle', title);
            });
        }

        // Load the post form
        if ($scope.post.form && $scope.post.form.id) {
            $q.all([
                FormEndpoint.get({id: $scope.post.form.id}),
                FormStageEndpoint.query({formId: $scope.post.form.id, postStatus: $scope.post.status}).$promise,
                FormAttributeEndpoint.query({formId: $scope.post.form.id}).$promise,
                TagEndpoint.query().$promise
            ]).then(function (results) {
                $scope.form = results[0];
                $scope.form_name = results[0].name;
                $scope.form_description = results[0].description;
                $scope.form_color = results[0].color;
                $scope.tags = results[3];
                $scope.postValues = [];
                // Set page title to '{form.name} Details' if a post title isn't provided.
                if (!$scope.post.title) {
                    $translate('post.type_details', {type: results[0].name}).then(function (title) {
                        $scope.$emit('setPageTitle', title);
                    });
                }
                var tasks = _.sortBy(results[1], 'priority');
                var attributes = _.chain(results[2])
                    .sortBy('priority')
                    .value();

                attributes.forEach(attr => {
                    $scope.form_attributes[attr.key] = attr;

                    if ($scope.post.values && attr.type !== 'title' &&
                        attr.type !== 'description' &&
                        typeof $scope.post.values[attr.key] !== undefined
                    ) {
                        $scope.postValues.push({'key': attr.key, 'value': $scope.post.values[attr.key]});
                    }
                });

                // Make the first task visible
                if (!_.isEmpty(tasks) && tasks.length > 1) {
                    $scope.visibleTask = tasks[1].id;
                    tasks[1].hasFileIcon = true;
                }

                _.each(tasks, function (task) {
                    // Set post task id
                    // NOTE: This assumes that there is only one Post Task per Post
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
                // Figure out which tasks have values
                $scope.tasks_with_attributes = [];

                _.each($scope.post.values, function (value, key) {

                    if ($scope.form_attributes[key]) {
                        $scope.tasks_with_attributes.push($scope.form_attributes[key].form_stage_id);
                    }

                });

                $scope.tasks_with_attributes = _.uniq($scope.tasks_with_attributes);
            });
        } else {
            // for when user switch between posts, if new post has no form, there are no tasks either.
            $scope.tasks = [];
        }
    }

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

    $scope.taskHasValues = function (task) {
        return _.contains($scope.tasks_with_attributes, task.id);
    };

    $scope.showTasks = function () {
        return $scope.tasks.length > 1;
    };

    $scope.isPostValue = function (key) {
        let ret =  $scope.form_attributes[key] && $scope.post_task &&
            $scope.form_attributes[key].form_stage_id === $scope.post_task.id;
        return ret;
    };

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

    $scope.publishPostTo = function (updatedPost) {
        // first check if tasks required have been marked complete
        var requiredTasks = _.where($scope.tasks, {required: true}),
            errors = [];

        _.each(requiredTasks, function (task) {
            // if this stage isn't complete, add to errors
            if (_.indexOf($scope.post.completed_stages, task.id) === -1) {
                errors.push($filter('translate')('post.modify.incomplete_step', {stage: task.label}));
            }
        });

        if (errors.length) {
            Notify.errorsPretranslated(errors); // todo WTF
            return;
        }

        $scope.post = updatedPost;

        PostEndpoint.update($scope.post).$promise
            .then(function () {
                var message = $scope.post.status === 'draft' ? 'notify.post.set_draft' : 'notify.post.publish_success';
                var role = message === 'draft' ? 'draft' : (_.isEmpty($scope.post.published_to) ? 'everyone' : $scope.post.published_to.join(', '));

                Notify.notify(message, {role: role});
            }, function (errorResponse) {
                Notify.apiErrors(errorResponse);
            });
    };

    $scope.close = function () {
        // Return to previous state, whatever that was.
        let previousState = $scope.$transition$.$from().name;
        // If we've jumped between 2 different posts
        // Or we loaded this view directly
        if (previousState === 'posts.data.detail' || previousState === '' || previousState === 'posts.data.edit') {
            // ... just return to the data list
            $state.go('posts.data');
        } else {
            // ... otherwise go to the previous stat
            $state.go(previousState);
        }
        $scope.$parent.deselectPost();
    };
}

