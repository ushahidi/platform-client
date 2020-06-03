module.exports = PostEditor;

PostEditor.$inject = [];

function PostEditor() {
    return {
        restrict: 'E',
        scope: {
            post: '=',
            formId: '='
        },
        template: require('./post-editor.html'),
        controller: PostEditorController
    };
}

PostEditorController.$inject = [
    '$scope',
    '$q',
    '$filter',
    '$location',
    '$translate',
    '$timeout',
    'moment',
    'PostEntity',
    'PostEndpoint',
    'PostLockEndpoint',
    'PostEditService',
    'PostLockService',
    'Notify',
    '_',
    'PostActionsService',
    'MediaEditService',
    '$state',
    'SurveysSdk',
    'TranslationService',
    'CategoriesSdk',
    'PostsSdk'
  ];

function PostEditorController(
    $scope,
    $q,
    $filter,
    $location,
    $translate,
    $timeout,
    moment,
    postEntity,
    PostEndpoint,
    PostLockEndpoint,
    PostEditService,
    PostLockService,
    Notify,
    _,
    PostActionsService,
    MediaEditService,
    $state,
    SurveysSdk,
    TranslationService,
    CategoriesSdk,
    PostsSdk
  ) {

    // Setup initial stages container
    $scope.everyone = $filter('translate')('post.modify.everyone');
    $scope.isEdit = !!$scope.post.id;
    $scope.validationErrors = [];
    $scope.visibleStage = 1;
    $scope.enableTitle = true;

    $scope.setVisibleStage = setVisibleStage;
    $scope.loadData = loadData;

    $scope.allowedChangeStatus = allowedChangeStatus;
    $scope.deletePost = deletePost;
    $scope.canSavePost = canSavePost;
    $scope.savePost = savePost;
    $scope.cancel = cancel;
    $scope.tagKeys = [];
    $scope.save = $translate.instant('app.save');
    $scope.saving = $translate.instant('app.saving');
    $scope.submit = $translate.instant('app.submit');
    $scope.submitting = $translate.instant('app.submitting');
    activate();

    function activate() {

        // $scope.availableSurveyLanguages = [$scope.form.enabled_languages.default, ...$scope.form.enabled_languages.available];
        $scope.loadData().then(function () {
            // Use $timeout to delay this check till after form fields are rendered.
            $timeout(() => {
                // If the post in marked as 'Published' but it is not in
                // a valid state to be saved as 'Published' warn the user
                if ($scope.post.status === 'published' && !canSavePost()) {
                    Notify.error('post.valid.invalid_state');
                }
            });
        });

        $scope.medias = {};
        $scope.savingText = $translate.instant('app.saving');
        $scope.submittingText = $translate.instant('app.submitting');
        TranslationService.getLanguage().then(language => {
            $scope.activeSurveyLanguage = {language};
        });
    }

    function setVisibleStage(stageId) {
        $scope.visibleStage = stageId;
    }

    function loadData() {
            var requests = [SurveysSdk.getSurveys($scope.formId), CategoriesSdk.getCategories()];

            // // If existing Post attempt to acquire lock
            if ($scope.post.id) {
                requests.push(PostLockEndpoint.getLock({'post_id': $scope.post.id}).$promise);
            }

        return $q.all(requests).then(function (results) {
            if ($scope.post.id && !results[2]) {
                // Failed to get a lock
                // Bounce user back to the detail page where admin/manage post perm
                // have the option to break the lock
                $state.go('posts.data.detail', {view: 'data', postId: $scope.post.id});
                return;
            }
            $scope.post.form = results[0];
            $scope.post.post_content = results[0].tasks;
            $scope.availableSurveyLanguages = [results[0].enabled_languages.default, ...results[0].enabled_languages.available];

            var categories = results[1];
            // Set Post Lock
            $scope.post.lock = results[2];

            // Initialize values on post (helps avoid madness in the template)
             $scope.post.post_content.map(task => {
                task.fields.map (attr => {
                    // Create associated media entity
                    if (attr.input === 'upload') {
                        $scope.medias[attr.id] = {};
                    }
                    if (attr.input === 'tags') {
                        // adding category-objects attribute-options
                        attr.options = PostActionsService.filterPostEditorCategories(attr.options, categories);
                    }
                    // @todo don't assign default when editing? or do something more sane
                    if (!attr.value) {
                         if (attr.input === 'number') {
                             if (attr.default) {
                                attr.value = parseInt(attr.default);
                             }
                        } else if (attr.input === 'date' || attr.input === 'datetime') {
                            attr.value = attr.default ? new Date(attr.default) : new Date();
                        }
                        else if (attr.input === 'tags') {
                            attr.value = [];
                        }
                    } else if (attr.input === 'date' || attr.input === 'datetime') {
                        // Date picker requires date object
                        // ensure that dates are preserved in UTC
                        if (attr.value) {
                            attr.value = moment(attr.value).toDate();
                        }
                    } else if (attr.input === 'number') {
                        // Number input requires a number
                        if (attr.value) {
                            attr.value = parseFloat(attr.value);
                        }
                    } else if (attr.input === 'tags') {
                        // tag.id needs to be a number
                        if (attr.value) {
                            attr.value = attr.value.map(function (id) {
                                return parseInt(id);
                            });
                        }
                    }
                });
            });
            // If number of completed stages matches number of tasks - not including Post,
            // assume they're all complete, and just show the first task
            if (post.completed_stages.length === $scope.tasks.length - 1 && $scope.tasks.length > 1) {
                $scope.setVisibleStage($scope.tasks[1].id);
            } else {
                // Get incomplete stages
                var incompleteStages = _.filter($scope.tasks, function (task) {
                    return !_.contains(post.completed_stages, task.id);
                });

                // Return lowest priority incomplete task - not including post
                incompleteStages.length > 1 ? $scope.setVisibleStage(incompleteStages[1].id) : '';
            }
        });
    }

    function canSavePost() {
        return PostEditService.validatePost($scope.post, $scope.postForm, $scope.tasks);
    }

    function cancel() {
        PostLockEndpoint.unlock($scope.post.lock).$promise.then(function (result) {
            if ($scope.post.id) {
                $state.go('posts.data.detail', {view: 'data', postId: $scope.post.id});
            } else {
                $state.go('posts.data');
            }
        });
    }

    function deletePost(post) {
        PostActionsService.delete(post).then(function () {
            $location.path('/');
        });
    }

    function allowedChangeStatus() {
        return $scope.post.allowed_privileges && $scope.post.allowed_privileges.indexOf('change_status') !== -1;
    }

    function resolveMedia() {
        return MediaEditService.saveMedia($scope.medias, $scope.post);
    }

    function savePost() {
        $scope.saving_post = true;
        if (!$scope.canSavePost()) {
            Notify.error('post.valid.validation_fail');
            $scope.saving_post = false;
            return;
        }
        // Create/update any associated media objects
        // Media creation must be completed before we can progress with saving
        resolveMedia().then(function () {
            // Clean up post values object
            var post = PostEditService.cleanPostValues(angular.copy($scope.post));
            post.base_language = $scope.activeSurveyLanguage.language;
            PostsSdk.savePost(post).then(function (response) {
                var success_message = (response.status && response.status === 'published') ? 'notify.post.save_success' : 'notify.post.save_success_review';
                if (response.id && response.allowed_privileges.indexOf('read') !== -1) {
                    $scope.saving_post = false;
                    $scope.post.id = response.id;
                    Notify.notify(success_message, { name: $scope.post.title });
                    $state.go('posts.data.detail', {postId: response.id});
                } else {
                    Notify.notify(success_message, { name: $scope.post.title });
                    $state.go('posts.map.all');
                }
            }, function (errorResponse) { // errors
                var validationErrors = [];
                // @todo refactor limit handling
                _.each(errorResponse.data.errors, function (value, key) {
                    // Ultimately this should check individual status codes
                    // for the moment just check for the message we expect
                    if (value.title === 'limit::posts') {
                        Notify.limit('limit.post_limit_reached');
                    } else {
                        validationErrors.push(value);
                    }
                });
                Notify.errors(_.pluck(validationErrors, 'message'));
                $scope.saving_post = false;
            });
        });
    }
}
