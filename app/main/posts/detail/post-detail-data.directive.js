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
    '$translate',
    '$filter',
    '_',
    'Notify',
    'PostSurveyService',
    '$state',
    'PostsSdk'
];
function PostDetailDataController(
    $scope,
    $translate,
    $filter,
    _,
    Notify,
    PostSurveyService,
    $state,
    PostsSdk
) {
    $scope.$watch('post', function (post) {
        activate();
    });
    // /* need to check for embed here to set the correct class
    // * if coming from map to detail-view in embed, TODO: should go to a service! */
    // var isEmbed = ($window.self !== $window.top) ? true : false;
    // isEmbed ? $rootScope.setLayout('layout-d layout-embed') : $rootScope.setLayout('layout-d');

    $scope.post = $scope.post;
    $scope.canCreatePostInSurvey = PostSurveyService.canCreatePostInSurvey;
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
                // Set page title to '{form.name} Details' if a post title isn't provided.
                if (!$scope.post.title) {
                    $translate('post.type_details', {type: $scope.post.form.name}).then(function (title) {
                        $scope.$emit('setPageTitle', title);
                    });
                }
                // Make the first task visible
                if (!_.isEmpty($scope.post.post_content) && $scope.post.post_content.length > 1) {
                    $scope.visibleTask = $scope.post.post_content[1].id;
                }

                _.each($scope.post.post_content, function (task) {
                    // Set post task id
                    // NOTE: This assumes that there is only one Post Task per Post
                    // Mark completed tasks
                        if (_.indexOf($scope.post.completed_stages, task.id) !== -1) {
                            task.completed = true;
                        }
                    });
                };
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
        let taskHasValues = false;
        _.each(task.fields, field => {
            if (field.value) {
                taskHasValues = true;
            }
        });
        return taskHasValues;
    };

    $scope.showType = function (type, field) {
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
        var requiredTasks = _.where($scope.post.post_content, {required: true}),
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

        PostsSdk.savePost($scope.post)
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
