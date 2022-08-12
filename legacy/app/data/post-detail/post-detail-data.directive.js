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
    'PostsSdk',
    'SurveysSdk',
    'UnifiedScopeForShowingLockInMetadata',
    'PostLockService',
    '$stateParams',
    'PostActionCheck',
    '$rootScope'
];
function PostDetailDataController(
    $scope,
    $translate,
    $filter,
    _,
    Notify,
    PostSurveyService,
    $state,
    PostsSdk,
    SurveysSdk,
    UnifiedScopeForShowingLockInMetadata,
    PostLockService,
    $stateParams,
    PostActionCheck,
    $rootScope
) {
    $scope.$watch('post', function (post, oldVal) {
        if (post !== oldVal) {
            activate();
        }
    });

    // broadcast is from Post Card directive
    $scope.$on('postWithLock', function ($event, postFromCard) {
        if (postFromCard.id === Number($stateParams.postId)) {
            // Set method to the (post detail) transfer service (on load)
            UnifiedScopeForShowingLockInMetadata.setPostForShowingLockInAnyView(postFromCard);
        }
    });

    $scope.$on('action', function ($event, actionsList) {
        PostActionCheck.setState(actionsList);
        // Show or hide post actions on load
        let postFromPostCard = UnifiedScopeForShowingLockInMetadata.getPostFromPostCard();
        if (!postFromPostCard.lock) {
            checkPostAction().showEdit = true;
            checkPostAction().openEditMode = function(postId) {
                $state.go('posts.data.edit', {postId: postId});
            };
            checkPostAction().showDivider = true;
            checkPostAction().showDelete = true;
        }
        if (postFromPostCard.lock && $rootScope.isAdmin()) {
            checkPostAction().showEdit = false;
            checkPostAction().openEditMode = function(postId) {
                // Ensure Post is not locked before proceeding
                if (!postIsUnlocked()) {
                    Notify.error('post.already_locked');
                    return;
                }
            };
            checkPostAction().showDivider = false;
            checkPostAction().showDelete = false;
        }
    });

    $scope.isPostLocked = isPostLocked;
    $scope.checkPostAction = checkPostAction;
    $scope.post = $scope.post.data.result;
    $scope.canCreatePostInSurvey = PostSurveyService.canCreatePostInSurvey;
    $scope.selectedPost = {post: $scope.post};
    $scope.languages = {
        active: $scope.post.enabled_languages.default,
        available: [$scope.post.enabled_languages.default, ...$scope.post.enabled_languages.available]
    };

    activate();

    function activate() {
        // Load the post form
        if ($scope.post && $scope.post.form_id && !$scope.post.form) {
                // Set page title to '{form.name} Details' if a post title isn't provided.
                SurveysSdk.findSurveyTo($scope.post.form_id, 'get_minimal_form').then(form => {
                    $scope.post.form = form;
                // Make the first task visible
                if (!_.isEmpty($scope.post.post_content) && $scope.post.post_content.length > 1) {
                    $scope.visibleTask = $scope.post.post_content[1].id;
                }
                _.each($scope.post.post_content, function (task) {
                    // Mark completed tasks
                        if (_.indexOf($scope.post.completed_stages, task.id) !== -1) {
                            task.completed = true;
                        }
                    });
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

    $scope.showType = function (type) {
        switch (type) {
            case 'geometry':
                return false;
            case 'title':
                return false;
            case 'description':
                return false;
            default:
                return true;
        };
    }

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

    function isPostLocked() {
        let postFromPostCard = UnifiedScopeForShowingLockInMetadata.getPostFromPostCard();
        return PostLockService.isPostLockedForCurrentUser(postFromPostCard);
    }

    function checkPostAction() {
        if ($scope.post.id === Number($stateParams.postId)) {
            return PostActionCheck.getState();
        }
    }
}
